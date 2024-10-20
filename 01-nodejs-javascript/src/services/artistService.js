require("dotenv").config();
const Artist = require("../models/Music");

const uploadMusicService = async (musicData) => {
    try {
        const music = await Artist.create(musicData); 
        return music;
    } catch (error) {
        console.error(error);
        throw new Error('Error saving music to the database');
    }
};


module.exports = { uploadMusicService };