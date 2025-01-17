const {
  createUserService,
  loginService,
  getUserService,
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
  getMusicInAlbumService,
  searchMusicService,
  getAlbumsService,
  followItemService,
  getFollowedItemsService,
  unfollowItemService,
} = require("../services/userService");
const { Account } = require("../models/associations");
const { upload, checkThumbnailSize } = require("../config/multerConfig");

const UserRegister = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, gender } = req.body;

    if (!name || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await createUserService({
      name,
      email,
      password,
      dateOfBirth,
      gender,
    });

    if (result.EC === 0) {
      return res.status(201).json({ message: result.EM, data: result.data });
    } else {
      return res.status(400).json({ message: result.EM });
    }
  } catch (error) {
    console.error("Error in createUser controller:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);

  return res.status(200).json(data);
};

const updateUser = async (req, res) => {
  try {
    const avatarFile = req.files?.avatar?.[0] || null;
    const { dateOfBirth, gender } = req.body;

    const account = await Account.findOne({ where: { email: req.user.email } });
    if (!account) {
      return res.status(400).json({ message: "Account not found" });
    }

    let avatarPath = account.avatarPath;

    if (avatarFile) {
      avatarPath = `avatars/${avatarFile.filename}`;
    }

    const profileData = {
      email: req.user.email,
      dateOfBirth,
      gender,
      avatarPath,
    };

    const updateResult = await updateUserService(profileData);
    return res.status(200).json(updateResult);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ EC: 7, EM: "Error updating profile" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const accountId = req.user.accountId;

    const updateResult = await updatePasswordService(
      accountId,
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (updateResult.EC === 0) {
      return res
        .status(200)
        .json({ message: "Password updated successfully!" });
    } else {
      return res.status(400).json({ message: updateResult.EM });
    }
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({ message: "Error updating password." });
  }
};

const sendOtp = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) {
      return res.status(400).json({ EC: 1, EM: "Email is required" });
    }
    const data = await generateOtp(email);
    return res.status(data.EC === 0 ? 200 : 400).json(data);
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).json({ EC: 3, EM: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ EC: 1, EM: "Invalid request parameters" });
    }
    const data = await verifyOtpAndUpdatePassword(email, otp, newPassword);
    return res.status(data.EC === 0 ? 200 : 400).json(data);
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ EC: 3, EM: "Internal server error" });
  }
};

const getAccount = async (req, res) => {
  const data = await getProfileService(req.user.accountId);
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
      const thumbnailPath = req.files.playlistThumbnail
        ? req.files.playlistThumbnail[0].path
        : null;

      const playlist = await createPlaylistService({
        name,
        thumbnailPath,
        accountId: account.accountId,
        creationDate: new Date(),
      });

      res
        .status(201)
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
  const playlists = await getPlaylistService(req.user.accountId);
  res.status(200).json(playlists);
};

// Controller function to get all musics
const getMusics = async (req, res) => {
  const musics = await getMusicService();
  res.status(200).json(musics);
};

// Controller function to get all albums
const getAlbums = async (req, res) => {
  const albums = await getAlbumsService();
  res.status(200).json(albums);
};

// Remove music from playlist function
const removeMusicFromPlaylist = async (req, res) => {
  try {
    const { playlistId, musicId } = req.body;
    const response = await removeMusicFromPlaylistService(playlistId, musicId);
    res.status(200).json(response);
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
    //console.log("Playlist ID:", playlistId);

    const musicList = await getMusicInPlaylistService(playlistId);
    res.status(200).json(musicList);
  } catch (error) {
    console.error("Error in getMusicInPlaylist:", error);
    res.status(500).json({ message: "Error fetching music in playlist" });
  }
};

const getMusicInAlbum = async (req, res) => {
  try {
    const { albumId } = req.body;
    if (!albumId) {
      return res.status(400).json({ message: "albumId is required" });
    }
    //console.log("Fetching music for albumId:", albumId);
    const musicList = await getMusicInAlbumService(albumId);
    res.status(200).json(musicList);
  } catch (error) {
    console.error("Error in getMusicInAlbum:", error.message);
    res.status(500).json({ message: "Error fetching music in album" });
  }
};

const searchMusic = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const results = await searchMusicService(searchTerm);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in searchMusic:", error);
    res.status(500).json({ message: "Error performing search" });
  }
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

// Follow an item
const followItem = async (req, res) => {
  try {
    const { followType, followId } = req.body;
    const accountId = req.user.accountId;

    //console.log("Follow API Input:", { accountId, followType, followId });

    const response = await followItemService(accountId, followType, followId);

    //console.log("Follow API Response:", response);

    if (response.EC !== 0) {
      return res.status(500).json({ message: response.EM });
    }
    res.status(201).json({ message: response.EM, follow: response.data });
  } catch (error) {
    console.error("Error in followItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get followed items
const getFollowedItems = async (req, res) => {
  try {
    const accountId = req.user.accountId;

    const response = await getFollowedItemsService(accountId);
    if (response.EC !== 0) {
      return res.status(500).json({ message: response.EM });
    }
    res
      .status(200)
      .json({ message: response.EM, followedItems: response.data });
  } catch (error) {
    console.error("Error in getFollowedItems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Unfollow an item
const unfollowItem = async (req, res) => {
  try {
    const { followType, followId } = req.body;
    const accountId = req.user.accountId;

    const response = await unfollowItemService(accountId, followType, followId);
    if (response.EC !== 0) {
      return res.status(400).json({ message: response.EM });
    }
    res.status(200).json({ message: response.EM });
  } catch (error) {
    console.error("Error in unfollowItem:", error);
    res.status(500).json({ message: "Internal server error" });
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
  getUser,
  getMusicInPlaylist,
  getMusicInAlbum,
  searchMusic,
  getAlbums,
  followItem,
  getFollowedItems,
  unfollowItem,
};
