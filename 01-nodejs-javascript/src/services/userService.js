require("dotenv").config();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mailService = require("../services/mailService");
const UserOTPVerification = require("../models/userOTPVerification");
const { sequelize } = require("../config/database");
const {
  Album,
  User,
  Playlist,
  Music,
  PlaylistMusic,
  UserFollow,
} = require("../models/associations");
const fs = require("fs");
const { Op } = require("sequelize");
const path = require("path");

// Create user service
const createUserService = async (
  name,
  email,
  password,
  dateOfBirth,
  gender
) => {
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`>>> user exists, use another email: "${email}"`);
      return { EC: 1, EM: "Email already exists" }; // Trả về lỗi cụ thể
    }

    // Hash mật khẩu
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Lưu user vào database
    const result = await User.create({
      name,
      email,
      password: hashPassword,
      dateOfBirth,
      gender,
      role: "User",
    });

    return { EC: 0, EM: "User created successfully", data: result };
  } catch (error) {
    console.error("Error in createUserService:", error);
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
          avatarPath: user.avatarPath,
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
            avatarPath: user.avatarPath,
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

const getUserService = async () => {
  try {
    let result = await User.findAll({ attributes: { exclude: ["password"] } });
    return result;
  } catch (error) {
    console.log(error);
    return { EC: 5, EM: "Error fetching users" };
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
const updateUserService = async (profileData) => {
  try {
    const user = await User.findOne({ where: { email: profileData.email } });
    if (!user) {
      return { EC: 6, EM: "User not found" };
    }

    // Kiểm tra thay đổi avatar và xóa avatar cũ nếu cần
    if (
      profileData.avatarPath &&
      user.avatarPath &&
      profileData.avatarPath !== user.avatarPath
    ) {
      const oldAvatarPath = path.join(__dirname, "../uploads", user.avatarPath); // Không thêm 'src/uploads' nữa
      console.log("Old Avatar Path:", oldAvatarPath); // Debug đường dẫn avatar cũ

      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath); // Xóa file avatar cũ
        console.log("Old avatar deleted successfully.");
      } else {
        console.log("Old avatar does not exist.");
      }
    }

    const updatedFields = {
      ...(profileData.dateOfBirth && { dateOfBirth: profileData.dateOfBirth }),
      ...(profileData.gender && { gender: profileData.gender }),
      ...(profileData.avatarPath && { avatarPath: profileData.avatarPath }),
    };

    await User.update(updatedFields, { where: { email: profileData.email } });
    return { EC: 0, EM: "Profile updated successfully" };
  } catch (error) {
    console.error("Error in updateUserService:", error);
    throw new Error("Error updating profile in the database");
  }
};

// Update password service
const updatePasswordService = async (
  id,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return { EC: 6, EM: "User not found" };
    }

    // Kiểm tra mật khẩu hiện tại
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return { EC: 7, EM: "Invalid current password" };
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      return { EC: 8, EM: "New password and confirmation do not match" };
    }

    // Hash mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id } });

    return { EC: 0, EM: "Password updated successfully" };
  } catch (error) {
    console.error("Error in updatePasswordService:", error);
    return { EC: 9, EM: "Error updating password" };
  }
};

// Generate OTP service
const generateOtp = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User not found" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);

    // Hủy các OTP trước đó của người dùng
    await UserOTPVerification.update(
      { status: false },
      { where: { email, status: true } }
    );

    // Tạo OTP mới
    const newOTP = await UserOTPVerification.create({
      email,
      otp: hashedOTP,
      userId: user.id,
      status: true, // Kích hoạt trạng thái ban đầu là true
    });

    // Gửi OTP qua email
    await mailService.sendOTP(email, otp);

    // Thiết lập tự động hủy sau 10 phút
    setTimeout(async () => {
      await UserOTPVerification.update(
        { status: false },
        { where: { id: newOTP.id } }
      );
    }, 10 * 60 * 1000); // 10 phút

    return { EC: 0, EM: "OTP sent successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error generating OTP" };
  }
};

// Verify OTP and update password service
const verifyOtpAndUpdatePassword = async (email, otp, newPassword) => {
  try {
    // Tìm user trong bảng users
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User not found" };
    }

    // Tìm OTP còn hiệu lực
    const existingOTP = await UserOTPVerification.findOne({
      where: { email, status: true }, // Chỉ lấy OTP có status = true
    });

    if (!existingOTP) {
      return { EC: 2, EM: "No valid OTP found" };
    }

    // Kiểm tra OTP
    const isMatchOtp = await bcrypt.compare(otp.toString(), existingOTP.otp);
    if (!isMatchOtp) {
      return { EC: 2, EM: "Invalid OTP" };
    }

    // Cập nhật mật khẩu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    // Cập nhật trạng thái OTP
    await UserOTPVerification.update(
      { status: false },
      { where: { id: existingOTP.id } }
    );

    return { EC: 0, EM: "Password updated successfully" };
  } catch (error) {
    console.error("Error in verifyOtpAndUpdatePassword:", error);
    return { EC: 3, EM: "Error verifying OTP" };
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
      attributes: { exclude: ["uploadDate"] },
    });
    return musics;
  } catch (error) {
    console.error("Error in getMusicService:", error);
    throw new Error("Error fetching musics");
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
    return playlist;
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
    return { message: "Music deleted successfully" };
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

    // Xóa tệp thumbnail của playlist nếu tồn tại
    if (playlist.thumbnailPath && fs.existsSync(playlist.thumbnailPath)) {
      fs.unlinkSync(playlist.thumbnailPath);
    }

    // Xóa playlist khỏi cơ sở dữ liệu
    await Playlist.destroy({ where: { id: playlistId } });

    return { message: "Playlist deleted successfully" };
  } catch (error) {
    console.error("Error in deletePlaylistService:", error);
    throw new Error("Error deleting playlist");
  }
};

const getMusicInPlaylistService = async (playlistId) => {
  try {
    const query = `
      SELECT
        m.id,
        m.title,
        m.artist,
        m.genre,
        m.albumId AS albumId,
        m.filePath,
        m.description,
        m.thumbnailPath,
        m.publishedYear
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

const getAlbumsService = async () => {
  try {
    const albums = await Album.findAll({
      attributes: { exclude: ["createdDate"] },
    });
    return albums;
  } catch (error) {
    console.error("Error in getAlbumsService:", error);
    throw new Error("Error fetching albums");
  }
};

const getMusicInAlbumService = async (albumId) => {
  try {
    // Fetch album to verify its existence
    const album = await Album.findOne({
      where: { id: albumId },
      attributes: ["id", "name", "artist"], // Lấy tên và nghệ sĩ của album
    });

    if (!album) {
      throw new Error("Album not found");
    }

    // Query để lấy dữ liệu bài hát kèm thông tin chi tiết
    const query = `
      SELECT 
        m.id,
        m.title,
        m.artist,
        m.genre,
        m.albumId AS albumId,
        m.filePath,
        m.description,
        m.thumbnailPath,
        m.publishedYear,
        a.name AS album
      FROM music m
      JOIN albums a ON m.albumId = a.id
      WHERE m.albumId = :albumId
    `;

    const musicList = await sequelize.query(query, {
      replacements: { albumId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (musicList.length === 0) {
      console.log("No music found for albumId:", albumId);
      throw new Error("No music found in this album");
    }

    return musicList;
  } catch (error) {
    console.error("Error in getMusicInAlbumService:", error.message || error);
    throw new Error("Error fetching music in album");
  }
};

const searchMusicService = async (searchTerm) => {
  try {
    const musicResults = await Music.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { genre: { [Op.like]: `%${searchTerm}%` } },
          { artist: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
    });

    const albumResults = await Album.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { artist: { [Op.like]: `%${searchTerm}%` } },
          { publishedYear: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
    });

    const artistResults = await User.findAll({
      where: {
        [Op.and]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { role: "Artist" },
        ],
      },
    });

    return {
      music: musicResults,
      albums: albumResults,
      artists: artistResults,
    };
  } catch (error) {
    console.error("Error in searchMusicService:", error);
    throw new Error("Error searching");
  }
};

// Follow an item
const followItemService = async (userId, followType, followId) => {
  try {
    const follow = await UserFollow.create({
      userId,
      followType,
      followId,
    });
    return { EC: 0, EM: "Followed successfully", data: follow };
  } catch (error) {
    console.error("Error in followItemService:", error);
    return { EC: 1, EM: "Error following item" };
  }
};

// Get followed items
const getFollowedItemsService = async (userId) => {
  try {
    //console.log("Fetching followed items for userId:", userId);

    const query = `
    SELECT 
      uf.followType, 
      uf.followId, 
      CASE 
        WHEN uf.followType = 'Album' THEN a.name 
        WHEN uf.followType = 'Artist' THEN u.name 
      END AS name,
      CASE 
        WHEN uf.followType = 'Album' THEN a.thumbnailPath 
        WHEN uf.followType = 'Artist' THEN u.avatarPath 
      END AS thumbnailPath
    FROM userfollows uf
    LEFT JOIN albums a ON uf.followId = a.id AND uf.followType = 'Album'
    LEFT JOIN users u ON uf.followId = u.id AND uf.followType = 'Artist'
    WHERE uf.userId = :userId
    `;

    const followedItems = await sequelize.query(query, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    //console.log("Followed items fetched:", followedItems);

    return {
      EC: 0,
      EM: "Fetched followed items successfully",
      data: followedItems,
    };
  } catch (error) {
    console.error("Error in getFollowedItemsService:", error);
    return { EC: 1, EM: "Error fetching followed items" };
  }
};

// Unfollow an item
const unfollowItemService = async (userId, followType, followId) => {
  try {
    const unfollow = await UserFollow.destroy({
      where: { userId, followType, followId },
    });
    if (!unfollow) {
      return { EC: 1, EM: "Item not followed" };
    }
    return { EC: 0, EM: "Unfollowed successfully" };
  } catch (error) {
    console.error("Error in unfollowItemService:", error);
    return { EC: 1, EM: "Error unfollowing item" };
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
  getUserService,
  getMusicInPlaylistService,
  getMusicInAlbumService,
  searchMusicService,
  getAlbumsService,
  followItemService,
  getFollowedItemsService,
  unfollowItemService,
};
