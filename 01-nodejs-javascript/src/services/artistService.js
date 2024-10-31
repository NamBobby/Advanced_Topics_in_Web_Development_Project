require("dotenv").config();
const Music = require("../models/Music");
const Album = require("../models/Album");

// Upload music
const uploadMusicService = async (musicData) => {
    try {
        const music = await Music.create(musicData);
        console.log("Music uploaded:", music); 
        return music;
    } catch (error) {
        console.error("Error in uploadMusicService:", error);
        throw new Error('Error saving music to the database');
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
        throw new Error('Error creating album');
    }
};

// Add music to album
const addMusicToAlbumService = async (albumId, musicId) => {
    try {
        const music = await Music.findByPk(musicId);
        if (!music) throw new Error('Music not found');

        music.albumId = albumId;
        await music.save();
        return music;
    } catch (error) {
        console.error("Error in addMusicToAlbumService:", error);
        throw new Error('Error adding music to album');
    }
};

// Remove music from album
const removeMusicFromAlbumService = async (musicId) => {
    try {
        const music = await Music.findByPk(musicId);
        if (!music) throw new Error('Music not found');

        music.albumId = null;
        await music.save();
        return music;
    } catch (error) {
        console.error("Error in removeMusicFromAlbumService:", error);
        throw new Error('Error removing music from album');
    }
};

// Delete album
const deleteAlbumService = async (albumId) => {
    try {
        const album = await Album.findByPk(albumId);
        if (!album) throw new Error('Album not found');

        await Music.update({ albumId: null }, { where: { albumId } });
        await Album.destroy({ where: { id: albumId } });
    } catch (error) {
        console.error("Error in deleteAlbumService:", error);
        throw new Error('Error deleting album');
    }
};

module.exports = {
    uploadMusicService,
    createAlbumService,
    addMusicToAlbumService,
    removeMusicFromAlbumService,
    deleteAlbumService
};
