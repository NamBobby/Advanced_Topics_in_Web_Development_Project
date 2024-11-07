require("dotenv").config();
// const Music = require("../models/Music");
// const Album = require("../models/Album");
const { sequelize } = require("../config/database");
const { Album, Music } = require("../models/associations");

// Upload music
const uploadMusicService = async (musicData) => {
  try {
    const music = await Music.create(musicData);
    console.log("Music uploaded:", music);
    return music;
  } catch (error) {
    console.error("Error in uploadMusicService:", error);
    throw new Error("Error saving music to the database");
  }
};

// Create album
const createAlbumService = async (albumData) => {
  try {
    const album = await Album.create(albumData);
    console.log("Album created:", album);
    return album;
  } catch (error) {
    console.error("Error in createAlbumService:", error);
    throw new Error("Error creating album");
  }
};

// Add music to album
const addMusicToAlbumService = async (albumId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");

    if (music.album || music.albumRef) {
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

    // Cập nhật albumId, albumRef và album cho music
    await Music.update(
      { albumId: albumId, albumRef: albumId, album: albumName },
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

    // Cập nhật albumId, albumRef và album cho music thành null
    await Music.update({ albumId: null, albumRef: null, album: null }, { where: { id: musicId } });

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
    if (!album) throw new Error("Album not found");

    await Music.update({ albumId: null }, { where: { albumId } });
    await Album.destroy({ where: { id: albumId } });

    return { message: "Album deleted successfully" };
  } catch (error) {
    console.error("Error in deleteAlbumService:", error);
    throw new Error("Error deleting album");
  }
};

module.exports = {
  uploadMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
};
