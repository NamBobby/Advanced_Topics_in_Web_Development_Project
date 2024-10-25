require("dotenv").config();
const Music = require("../models/Music");

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

module.exports = { uploadMusicService };
