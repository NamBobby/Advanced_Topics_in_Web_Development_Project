require("dotenv").config();
const User = require("../models/Account");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mailService = require("../services/mailService");
const UserOTPVerification = require("../models/UserOTPVerification");
const { sequelize } = require("../config/database");
const {
  Album,
  Account,
  Playlist,
  Music,
  PlaylistMusic,
} = require("../models/associations");

const { Op } = require("sequelize");

// Create user service
const createUserService = async (
  name,
  email,
  password,
  dateOfBirth,
  gender
) => {
  try {
    // Check user existence
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`>>> user exists, use another email: "${email}"`);
      return null;
    }

    // Hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // Save user to database
    let result = await User.create({
      name,
      email,
      password: hashPassword,
      dateOfBirth,
      gender,
      role: "User ",
    });
    return result;
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error creating user" };
  }
};

// Login service
const loginService = async (email, password) => {
  try {
    // Fetch user by email
    const user = await User.findOne({ where: { email } });
    if (user) {
      // Compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password errors",
        };
      } else {
        // Create an access token
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            role: user.role,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password errors",
      };
    }
  } catch (error) {
    console.log(error);
    return { EC: 4, EM: "Error logging in" };
  }
};

// Get users service
const getProfileService = async (id) => {
  try {
    let result = await User.findAll({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    return result;
  } catch (error) {
    console.log(error);
    return { EC: 5, EM: "Error fetching users" };
  }
};

// Update user service
const updateUserService = async (id, dateOfBirth, gender) => {
  try {
    // Fetch user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return { EC: 6, EM: "User   not found" };
    }

    // Update date of birth
    user.dateOfBirth = dateOfBirth;

    // Update gender
    user.gender = gender;

    await user.save();

    return { EC: 0, EM: "Profile updated successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 7, EM: "Error updating profile" };
  }
};

// Update password service
const updatePasswordService = async (
  id,
  password,
  newPassword,
  confirmPassword
) => {
  try {
    // Fetch user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return { EC: 6, EM: "User  not found" };
    }

    // Check if current password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { EC: 7, EM: "Invalid current password" };
    }

    // Check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      return { EC: 8, EM: "New password and confirmation do not match" };
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { EC: 0, EM: "Password updated successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 9, EM: "Error updating password" };
  }
};

// Generate OTP service
const generateOtp = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User   not found" };
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);

    // Check if an OTP verification record already exists
    const existingOTPVerification = await UserOTPVerification.findOne({
      where: { email },
    });
    if (existingOTPVerification) {
      // Update the existing record
      existingOTPVerification.otp = hashedOTP;
      existingOTPVerification.createdAt = Date.now();
      existingOTPVerification.expiresAt = Date.now() + 180000;
      await existingOTPVerification.save();
    } else {
      // Create a new OTP verification record
      const newOTPVerification = await UserOTPVerification.create({
        email, // Include the email value here
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 180000,
      });
      await newOTPVerification.save();
    }

    // Send the OTP to the user's email
    await mailService.sendOTP(email, otp);

    return { EC: 0, EM: `OTP: ${otp} sent successfully` };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error sending OTP" };
  }
};

// Verify OTP and update password service
const verifyOtpAndUpdatePassword = async (
  email,
  otp,
  newPassword,
  confirmPassword
) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User not found" };
    }

    // Verify the OTP
    const existingOTPVerification = await UserOTPVerification.findOne({
      where: { email },
    });
    if (!existingOTPVerification) {
      return { EC: 2, EM: "OTP not found" };
    }

    const isMatchOtp = await bcrypt.compare(
      otp.toString(),
      existingOTPVerification.otp
    );
    if (!isMatchOtp) {
      return { EC: 2, EM: "Invalid OTP" };
    }

    // Update the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return { EC: 0, EM: "Password updated successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error updating password" };
  }
};

// Create playlist
const createPlaylistService = async (playlistData) => {
  try {
    const playlist = await Playlist.create(playlistData);
    console.log("Playlist created:", playlist);
    return playlist;
  } catch (error) {
    console.error("Error in createPlaylistService:", error);
    throw new Error("Error creating playlist");
  }
};

// Service to get playlists for a user
const getPlaylistService = async (accountId) => {
  try {
    const playlists = await Playlist.findAll({ where: { accountId } });
    return playlists;
  } catch (error) {
    console.error("Error in getPlaylistService:", error);
    throw new Error("Error fetching playlists");
  }
};

// Service to get playlists for a user
const getMusicService = async () => {
  try {
    const musics = await Music.findAll({
      attributes: { exclude: ["uploadDate", "accountId", "albumRef"] },
    });
    return musics;
  } catch (error) {
    console.error("Error in getPlaylistService:", error);
    throw new Error("Error fetching playlists");
  }
};

// Add music to playlist
const addMusicToPlaylistService = async (playlistId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");

    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    await PlaylistMusic.create({
      playlistId: playlistId,
      musicId: musicId,
    });
    return music;
  } catch (error) {
    console.error("Error in addMusicToPlaylistService:", error);
    throw new Error("Error adding music to playlist");
  }
};

// Remove music from playlist
const removeMusicFromPlaylistService = async (playlistId, musicId) => {
  try {
    const music = await Music.findByPk(musicId);
    if (!music) throw new Error("Music not found");
    await PlaylistMusic.destroy({
      where: { playlistId: playlistId, musicId: musicId },
    });
    return music;
  } catch (error) {
    console.error("Error in removeMusicFromPlaylistService:", error);
    throw new Error("Error removing music from playlist");
  }
};

// Delete playlist
const deletePlaylistService = async (playlistId) => {
  try {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    await Playlist.destroy({ where: { id: playlistId } });
  } catch (error) {
    console.error("Error in deletePlaylistService:", error);
    throw new Error("Error deleting playlist");
  }
};

const getMusicInPlaylistService = async (playlistId) => {
  try {
    const query = `
      SELECT m.title, m.artist, m.genre, m.album, m.filePath
      FROM playlistmusics pm
      INNER JOIN music m ON pm.musicId = m.id
      WHERE pm.playlistId = :playlistId
    `;

    const musicList = await sequelize.query(query, {
      replacements: { playlistId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (musicList.length === 0) {
      console.log("No music found for playlistId:", playlistId);
      throw new Error("No music found");
    }

    return musicList;
  } catch (error) {
    console.error("Error in getMusicInPlaylistService:", error);
    throw new Error("Error fetching music in playlist");
  }
};

const getUserAlbumsService = async (name) => {
  try {
    const artist = await Account.findOne({
      where: { name: name, role: "Artist" },
      attributes: ["id"],
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const albums = await Album.findAll({
      where: { accountId: artist.id },
      attributes: ["name", "thumbnailPath", "publishedYear"],
    });

    return albums;
  } catch (error) {
    console.error("Error in getUserAlbumsService:", error);
    throw new Error("Error fetching albums for user");
  }
};

const getMusicInAlbumService = async (name, albumId) => {
  try {
    const artist = await Account.findOne({
      where: { name: name, role: "Artist" },
      attributes: ["id"],
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const album = await Album.findOne({
      where: { id: albumId, accountId: artist.id },
      attributes: ["id"],
    });

    if (!album) {
      throw new Error("Album not found for the given artist");
    }

    const query = `
      SELECT m.title, m.artist, m.genre, m.album, m.filePath
      FROM albums a
      INNER JOIN music m ON a.id = m.albumRef
      WHERE a.id = :albumId
    `;

    const musicList = await sequelize.query(query, {
      replacements: { albumId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (musicList.length === 0) {
      console.log("No music found for albumId:", albumId);
      throw new Error("No music found");
    }

    return musicList;
  } catch (error) {
    console.error("Error in getMusicInAlbumService:", error);
    throw new Error("Error fetching music in album");
  }
};

const searchMusicService = async (searchTerm) => {
  try {
    const results = await Music.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { artist: { [Op.like]: `%${searchTerm}%` } },
          { genre: { [Op.like]: `%${searchTerm}%` } },
          { album: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: Album,
          as: "AlbumDetails",
          attributes: ["name"],
          where: { name: { [Op.like]: `%${searchTerm}%` } },
          required: false,
        },
      ],
      attributes: ["title", "artist", "genre", "album"],
      raw: true,
    });

    const processedResults = results.map((result) => {
      if (result["AlbumDetails.name"]) {
        result.albumName = result["AlbumDetails.name"];
      }
      delete result["AlbumDetails.name"];
      return result;
    });

    return processedResults;
  } catch (error) {
    console.error("Error in searchMusicService:", error);
    throw new Error("Error searching music");
  }
};

module.exports = {
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
};
