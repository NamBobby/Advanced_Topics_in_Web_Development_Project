require("dotenv").config();
const { sequelize } = require("../config/database");
const { Album, Music } = require("../models/associations");

const { uploadToGitHub, deleteFromGitHub, uuidv4 } = require("../utils/utils");

// Upload music
const uploadMusicService = async (
  account,
  musicFile,
  thumbnailFile,
  musicData
) => {
  // Upload music file to GitHub
  const musicFileName = `${uuidv4()}_${musicFile.originalname}`;
  const musicFilePath = `uploads/music/${musicFileName}`;
  const musicFileUrl = await uploadToGitHub(musicFile.buffer, musicFilePath);

  // Upload thumbnail file to GitHub
  let thumbnailFileUrl = null;
  if (thumbnailFile) {
    const thumbnailFileName = `${uuidv4()}_${thumbnailFile.originalname}`;
    const thumbnailFilePath = `uploads/music/thumbnails/${thumbnailFileName}`;
    thumbnailFileUrl = await uploadToGitHub(
      thumbnailFile.buffer,
      thumbnailFilePath
    );
  }

  const music = await Music.create({
    ...musicData,
    artist: account.name,
    filePath: musicFileUrl,
    thumbnailPath: thumbnailFileUrl,
    uploadDate: new Date(),
    accountId: account.id,
  });

  return music;
};

// Create album
const createAlbumService = async (account, thumbnailFile, albumData) => {
  // Upload thumbnail file to GitHub
  let thumbnailFileUrl = null;
  if (thumbnailFile) {
    const thumbnailFileName = `${uuidv4()}_${thumbnailFile.originalname}`;
    const thumbnailFilePath = `uploads/albums/${thumbnailFileName}`;
    thumbnailFileUrl = await uploadToGitHub(
      thumbnailFile.buffer,
      thumbnailFilePath
    );
  }

  const album = await Album.create({
    ...albumData,
    artist: account.name,
    thumbnailPath: thumbnailFileUrl, // Save the GitHub URL for thumbnail file
    accountId: account.id,
    creationDate: new Date(),
  });

  return album;
};

// Add music to album
const addMusicToAlbumService = async (albumId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");

    if (music.album || music.albumId) {
      throw new Error("Music is already associated with an album");
    }

    const album = await Album.findByPk(albumId);
    if (!album) throw new Error("Album not found");

    // Lấy tên album bằng truy vấn SQL thô
    const [albumNameResult] = await sequelize.query(
      `
      SELECT name FROM albums WHERE id = :albumId
    `,
      {
        replacements: { albumId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const albumName = albumNameResult.name;

    // Cập nhật albumId và album cho music
    await Music.update(
      { albumId: albumId, albumId: albumId, album: albumName },
      { where: { id: musicId } }
    );

    // Lấy lại thông tin music để trả về kết quả cập nhật
    const updatedMusic = await Music.findByPk(musicId);

    return updatedMusic;
  } catch (error) {
    console.error("Error in addMusicToAlbumService:", error);
    throw error;
  }
};

// Remove music from album
const removeMusicFromAlbumService = async (albumId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");

    // Cập nhật albumId và album cho music thành null
    await Music.update(
      { albumId: null, album: null },
      { where: { id: musicId } }
    );

    const updatedMusic = await Music.findByPk(musicId);

    return updatedMusic;
  } catch (error) {
    console.error("Error in removeMusicFromAlbumService:", error);
    throw error;
  }
};

// Delete album
const deleteAlbumService = async (albumId) => {
  try {
    const album = await Album.findByPk(albumId);

    if (!album) {
      throw new Error("Album not found");
    }

    // Delete album thumbnail file from GitHub
    if (album.thumbnailPath) {
      const thumbnailFileName = album.thumbnailPath.split("/").pop();
      const thumbnailFilePath = `uploads/albums/${thumbnailFileName}`;
      await deleteFromGitHub(thumbnailFilePath);
    }

    // Update albumId to null for related music records
    await Music.update({ albumId: null, album: null }, { where: { albumId } });

    // Delete record from MySQL
    await Album.destroy({ where: { id: albumId } });

    return { message: "Album deleted successfully" };
  } catch (error) {
    console.error("Error in deleteAlbumService:", error);
    throw error;
  }
};

const deleteMusicService = async (musicId) => {
  try {
    const music = await Music.findByPk(musicId);

    if (!music) {
      throw new Error("Music not found");
    }

    // Delete music file from GitHub
    if (music.filePath) {
      const musicFileName = music.filePath.split("/").pop();
      const musicFilePath = `uploads/music/${musicFileName}`;
      await deleteFromGitHub(musicFilePath);
    }

    // Delete thumbnail file from GitHub
    if (music.thumbnailPath) {
      const thumbnailFileName = music.thumbnailPath.split("/").pop();
      const thumbnailFilePath = `uploads/music/thumbnails/${thumbnailFileName}`;
      await deleteFromGitHub(thumbnailFilePath);
    }

    // Delete record from MySQL
    await Music.destroy({ where: { id: musicId } });

    return { message: "Music deleted successfully" };
  } catch (error) {
    console.error("Error in deleteMusicService:", error);
    throw error;
  }
};

module.exports = {
  uploadMusicService,
  deleteMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
};
