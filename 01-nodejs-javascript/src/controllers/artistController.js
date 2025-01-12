const {
  uploadMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
  deleteMusicService,
} = require("../services/artistService");
const { upload, checkThumbnailSize } = require("../config/multerConfig");
const { Artist, Account } = require("../models/associations");

// Upload music function
const uploadMusical = [
  upload,
  checkThumbnailSize,
  async (req, res) => {
    try {
      const musicFile = req.files.musicFile ? req.files.musicFile[0] : null;
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      if (!musicFile) {
        return res.status(400).json({ message: "No music file uploaded" });
      }

      const { accountId, role } = req.user;
      if (role !== "Artist") {
        return res.status(403).json({ message: "Only artists can upload music" });
      }

      const artist = await Artist.findOne({ where: { accountId } });
      const account = await Account.findOne({ where: { accountId } });

      if (!artist) {
        return res.status(400).json({ message: "Artist account not found" });
      }

      const { title, genre, publishedYear, description, albumId } = req.body;

      if (!title || !genre || !publishedYear) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const filePath = musicFile.path;
      const thumbnailPath = thumbnailFile ? thumbnailFile.path : null;

      const musicData = {
        title,
        artist: account.name,
        genre,
        filePath,
        publishedYear,
        description,
        thumbnailPath,
        uploadDate: new Date(),
        accountId: artist.accountId,
        albumId: albumId || null,
      };

      const music = await uploadMusicService(musicData);
      res.status(201).json({ message: "Music uploaded successfully", music });
    } catch (error) {
      console.error("Error in uploadMusical:", error);
      res.status(500).json({ message: "Error uploading music" });
    }
  },
];

const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteMusicService(id);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in deleteMusic:', error);
    res.status(500).json({ message: 'Error deleting music' });
  }
};

// Create album function
const createAlbum = [
  upload,
  checkThumbnailSize,
  async (req, res) => {
    try {
      const thumbnailFile = req.files.albumThumbnail ? req.files.albumThumbnail[0] : null;

      const { accountId, role } = req.user;
      if (role !== "Artist") {
        return res.status(403).json({ message: "Only artists can upload music" });
      }

      const artist = await Artist.findOne({ where: { accountId } });
      const account = await Account.findOne({ where: { accountId } });
      if (!artist || !account) {
        return res.status(400).json({ message: "Artist account not found" });
      }
      
      const { name, publishedYear } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Album name is required" });
      }

      const albumData = {
        name,
        artist: account.name,
        thumbnailPath: thumbnailFile ? thumbnailFile.path : null,
        publishedYear: publishedYear || null,
        accountId: artist.accountId,
        creationDate: new Date(),
      };

      const album = await createAlbumService(albumData);
      res.status(201).json({ message: "Album created successfully", album });
    } catch (error) {
      console.error("Error in createAlbum:", error);
      res.status(500).json({ message: "Error creating album" });
    }
  },
];

// Add music to album function
const addMusicToAlbum = async (req, res) => {
  try {
    const { albumId, musicId } = req.body;

    const music = await addMusicToAlbumService(albumId, musicId);
    res
      .status(200)
      .json({ message: "Music added to album successfully", music });
  } catch (error) {
    if (error.message === "Music is already associated with an album") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error in addMusicToAlbum:", error);
      res.status(500).json({ message: "Error adding music to album" });
    }
  }
};

// Remove music from album function
const removeMusicFromAlbum = async (req, res) => {
  try {
    const { albumId, musicId } = req.body;

    const music = await removeMusicFromAlbumService(albumId, musicId);
    res
      .status(200)
      .json({ message: "Music removed from album successfully", music });
  } catch (error) {
    console.error("Error in removeMusicFromAlbum:", error);
    res.status(500).json({ message: "Error removing music from album" });
  }
};

// Delete album function
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteAlbumService(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in deleteAlbum:", error);
    res.status(500).json({ message: "Error deleting album" });
  }
};

module.exports = {
  uploadMusical,
  deleteMusic,
  createAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
  deleteAlbum,
};
