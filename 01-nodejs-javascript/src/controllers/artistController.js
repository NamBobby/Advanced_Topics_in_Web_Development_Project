const {
  uploadMusicService,
  createAlbumService,
  addMusicToAlbumService,
  removeMusicFromAlbumService,
  deleteAlbumService,
  deleteMusicService,
} = require("../services/artistService");

const Account = require("../models/Account");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

      const music = await uploadMusicService(
        account,
        musicFile,
        thumbnailFile,
        {
          title,
          genre,
          album,
          publishedYear,
          description,
          albumId: req.body.albumId,
        }
      );

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
      const thumbnailFile = req.file ? req.file : null;

      const account = await Account.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const album = await createAlbumService(account, thumbnailFile, {
        name,
        publishedYear,
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

const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteMusicService(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in deleteMusic:", error);
    res.status(500).json({ message: "Error deleting music" });
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
