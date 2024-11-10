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
  getMusicInPlaylistService,
  getUserAlbumsService,
  getMusicInAlbumService,
  searchMusicService,
} = require("../services/userService");
const Account = require("../models/account");
const { upload, checkThumbnailSize } = require("../config/multerConfig");

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

// Create playlist function
const createPlaylist = [
  upload,
  checkThumbnailSize,
  async (req, res) => {
    try {
      const account = await Account.findOne({
        where: { email: req.user.email },
      });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const { name } = req.body;
      const thumbnailPath = req.files.playlistThumbnail ? req.files.playlistThumbnail[0].path : null;

      const playlist = await createPlaylistService({
        name,
        thumbnailPath,
        accountId: account.id,
        creationDate: new Date(),
      });

      res.status(201).json({ message: "Playlist created successfully", playlist });
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
    const response = await removeMusicFromPlaylistService(playlistId, musicId);
    res
      .status(200)
      .json(response);
  } catch (error) {
    console.error("Error in removeMusicFromPlaylist:", error);
    res.status(500).json({ message: "Error removing music from playlist" });
  }
};

// Delete playlist function
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deletePlaylistService(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in deletePlaylist:", error);
    res.status(500).json({ message: "Error deleting playlist" });
  }
};

const getMusicInPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    console.log("Playlist ID:", playlistId); 

    const musicList = await getMusicInPlaylistService(playlistId);
    res.status(200).json(musicList);
  } catch (error) {
    console.error("Error in getMusicInPlaylist:", error);
    res.status(500).json({ message: "Error fetching music in playlist" });
  }
};

const getUserAlbums = async (req, res) => {
  try {
    const { name } = req.body;

    const albums = await getUserAlbumsService(name);
    res.status(200).json(albums);
  } catch (error) {
    if (error.message === "Artist not found") {
      res.status(404).json({ message: error.message });
    } else {
      console.error("Error in getUserAlbums:", error);
      res.status(500).json({ message: "Error fetching albums for user" });
    }
  }
};

const getMusicInAlbum = async (req, res) => {
  try {
    const { name, albumId } = req.body;

    const musicList = await getMusicInAlbumService(name, albumId);
    res.status(200).json(musicList);
  } catch (error) {
    if (error.message === "Artist not found" || error.message === "Album not found for the given artist") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "No music found in the album") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error in getMusicInAlbum:", error);
      res.status(500).json({ message: "Error fetching music in album" });
    }
  }
};

const searchMusic = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    const results = await searchMusicService(searchTerm);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in searchMusic:", error);
    res.status(500).json({ message: "Error searching music" });
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
  getMusicInPlaylist,
  getUserAlbums,
  getMusicInAlbum,
  searchMusic,
};
