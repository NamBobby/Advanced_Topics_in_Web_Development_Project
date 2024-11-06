const {
  uploadMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
} = require("../services/artistService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Account = require("../models/Account");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "musicFile") {
      cb(null, "./src/uploads/music/");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "./src/uploads/music/thumbnails/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload music function
const uploadMusical = [
  upload.fields([
    { name: "musicFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const musicFile = req.files.musicFile ? req.files.musicFile[0] : null;
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      if (!musicFile) {
        return res.status(400).json({ message: "No music file uploaded" });
      }

      const { title, genre, album, publishedYear, description } = req.body;

      if (!title || !genre || !publishedYear) {
        return res
          .status(400)
          .json({ message: "Please fill in all required fields" });
      }

      const account = await Account.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const filePath = musicFile.path;
      const thumbnailPath = thumbnailFile ? thumbnailFile.path : null;

      const music = await uploadMusicService({
        title,
        artist: account.name,
        genre,
        album,
        filePath,
        publishedYear,
        description,
        thumbnailPath,
        uploadDate: new Date(),
        accountId: account.id,
        albumId: req.body.albumId,
      });

      // Detele file after stored to mySQL
      if (thumbnailPath) {
        fs.unlink(thumbnailPath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

      res.status(201).json({ message: "Music uploaded successfully", music });
    } catch (error) {
      console.error("Error in uploadMusical:", error);
      res.status(500).json({ message: "Error uploading music" });
    }
  },
];

// Create album function
const createAlbum = [
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { name, publishedYear } = req.body;
      const thumbnailPath = req.file ? req.file.path : null;

      const account = await Account.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const album = await createAlbumService({
        name,
        artist: account.name,
        thumbnailPath,
        publishedYear,
        accountId: account.id,
        creationDate: new Date(),
      });

      if (thumbnailPath) {
        fs.unlink(thumbnailPath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

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
    console.error("Error in addMusicToAlbum:", error);
    res.status(500).json({ message: "Error adding music to album" });
  }
};

// Remove music from album function
const removeMusicFromAlbum = async (req, res) => {
  try {
    const { musicId } = req.body;

    const music = await removeMusicFromAlbumService(musicId);
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
    const { albumId } = req.body;

    await deleteAlbumService(albumId);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAlbum:", error);
    res.status(500).json({ message: "Error deleting album" });
  }
};

module.exports = {
  uploadMusical,
  createAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
  deleteAlbum,
};
