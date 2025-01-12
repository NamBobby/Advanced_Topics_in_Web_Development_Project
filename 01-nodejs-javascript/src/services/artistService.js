require("dotenv").config();
const { sequelize } = require("../config/database");
const { Album, Music } = require("../models/associations");
const fs = require("fs");

// Upload music service
const uploadMusicService = async (musicData) => {
  try {
    const { title, genre, filePath, accountId } = musicData;
    if (!title || !genre || !filePath || !accountId) {
      throw new Error("Missing required fields for uploading music");
    }

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
    const { name, accountId } = albumData;
    if (!name || !accountId) {
      throw new Error("Missing required fields for creating album");
    }

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

    if (!music) {
      throw new Error("Music not found");
    }

    if (music.albumId) {
      throw new Error("Music is already associated with an album");
    }

    const album = await Album.findByPk(albumId);
    if (!album) throw new Error("Album not found");

    await Music.update(
      { albumId: albumId },
      { where: { musicId: musicId } }
    );

    const updatedMusic = await Music.findByPk(musicId);

    return updatedMusic;
  } catch (error) {
    console.error("Error in addMusicToAlbumService:", error);
    throw error;
  }
};

const deleteMusicService = async (musicId) => {
  try {
    const music = await Music.findByPk(musicId);

    if (!music) {
      throw new Error("Music not found");
    }

    if (music.filePath && fs.existsSync(music.filePath)) {
      fs.unlinkSync(music.filePath);
    }

    if (music.thumbnailPath && fs.existsSync(music.thumbnailPath)) {
      fs.unlinkSync(music.thumbnailPath);
    }

    await Music.destroy({ where: { musicId: musicId } });

    return { message: "Music deleted successfully" };
  } catch (error) {
    console.error("Error in deleteMusicService:", error);
    throw error;
  }
};

// Remove music from album
const removeMusicFromAlbumService = async (albumId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");

    const album = await Album.findByPk(albumId);
    if (!album) throw new Error("Album not found");

    await Music.update(
      { albumId: null },
      { where: { musicId: musicId } }
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

    if (album.thumbnailPath && fs.existsSync(album.thumbnailPath)) {
      fs.unlinkSync(album.thumbnailPath);
    }

    await Music.update({ albumId: null }, { where: { albumId } });

    await Album.destroy({ where: { albumId: albumId } });

    return { message: "Album deleted successfully" };
  } catch (error) {
    console.error("Error in deleteAlbumService:", error);
    throw error;
  }
};

module.exports = {
  uploadMusicService,
  addMusicToAlbumService,
  uploadMusicService,
  deleteMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
};
