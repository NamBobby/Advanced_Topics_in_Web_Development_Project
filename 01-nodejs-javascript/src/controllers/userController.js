const {
  createUserService,
  loginService,
  getProfileService,
  updateUserService,
  updatePasswordService,
  generateOtp,
  verifyOtpAndUpdatePassword,
  createPlaylistService,
  addMusicToPlaylistService,
  removeMusicFromPlaylistService,
  deletePlaylistService,
  getPlaylistService,
  getMusicService,
} = require("../services/userService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Account = require("../models/Account");

const UserRegister = async (req, res) => {
  const { name, email, password, dateOfBirth, gender } = req.body;
  const data = await createUserService(
    name,
    email,
    password,
    dateOfBirth,
    gender
  );
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);

  return res.status(200).json(data);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { dateOfBirth, gender } = req.body;
  const data = await updateUserService(id, dateOfBirth, gender);
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const data = await updatePasswordService(
    id,
    currentPassword,
    newPassword,
    confirmPassword
  );
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const data = await generateOtp(email);
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  const data = await verifyOtpAndUpdatePassword(
    email,
    otp,
    newPassword,
    confirmPassword
  );
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  const data = await getProfileService(req.user.id);
  return res.status(200).json(data);
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/playlists/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create playlist function
const createPlaylist = [
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const account = await Account.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const { name } = req.body;
      const thumbnailPath = req.file ? req.file.path : null;

      const playlist = await createPlaylistService({
        name,
        thumbnailPath,
        accountId: account.id,
        creationDate: new Date(),
      });

      // Detele file after stored to mySQL
      if (thumbnailPath) {
        fs.unlink(thumbnailPath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Playlist created successfully", playlist });
    } catch (error) {
      console.error("Error in createPlaylist:", error);
      res.status(500).json({ message: "Error creating playlist" });
    }
  },
];

// Add music to playlist function
const addMusicToPlaylist = async (req, res) => {
  try {
    const { playlistId, musicId } = req.body;

    const music = await addMusicToPlaylistService(playlistId, musicId);
    res
      .status(200)
      .json({ message: "Music added to playlist successfully", music });
  } catch (error) {
    console.error("Error in addMusicToPlaylist:", error);
    res.status(500).json({ message: "Error adding music to playlist" });
  }
};

// Controller function to get playlists for a user
const getPlaylists = async (req, res) => {
  const playlists = await getPlaylistService(req.user.id);
  res.status(200).json(playlists);
};

// Controller function to get all musics
const getMusics = async (req, res) => {
  const musics = await getMusicService();
  res.status(200).json(musics);
};

// Remove music from playlist function
const removeMusicFromPlaylist = async (req, res) => {
  try {
    const { playlistId, musicId } = req.body;
    const music = await removeMusicFromPlaylistService(playlistId, musicId);
    res
      .status(200)
      .json({ message: "Music removed from playlist successfully", music });
  } catch (error) {
    console.error("Error in removeMusicFromPlaylist:", error);
    res.status(500).json({ message: "Error removing music from playlist" });
  }
};

// Delete playlist function
const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;

    await deletePlaylistService(playlistId);
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error in deletePlaylist:", error);
    res.status(500).json({ message: "Error deleting playlist" });
  }
};

module.exports = {
  UserRegister,
  handleLogin,
  getAccount,
  updateUser,
  updatePassword,
  sendOtp,
  verifyOtp,
  createPlaylist,
  getPlaylists,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  deletePlaylist,
  getMusics,
};
