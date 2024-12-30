const {
  uploadMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
  deleteMusicService,
} = require("../services/artistService");
const { upload, checkThumbnailSize } = require("../config/multerConfig");
const User = require("../models/user");

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

      const { title, genre, publishedYear, description, albumId } = req.body;

      if (!title || !genre || !publishedYear) {
        return res.status(400).json({ message: "Please fill in all required fields" });
      }

      const account = await User.findOne({ where: { email: req.user.email } });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
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
        accountId: account.id,
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
      const { name, publishedYear } = req.body;
      const thumbnailFile = req.files.albumThumbnail ? req.files.albumThumbnail[0] : null;

      const account = await User.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const thumbnailPath = thumbnailFile ? thumbnailFile.path : null;

      const album = await createAlbumService({
        name,
        artist: account.name,
        thumbnailPath,
        publishedYear,
        accountId: account.id,
        creationDate: new Date(),
      });

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
