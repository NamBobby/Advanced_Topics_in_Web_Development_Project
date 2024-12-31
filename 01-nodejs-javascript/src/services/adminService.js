require("dotenv").config();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { User, Playlist, Album, Music } = require("../models/associations");
const saltRounds = 10;

const createUserService = async (
  name,
  email,
  password,
  dateOfBirth,
  gender,
  role
) => {
  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { EC: 1, EM: "Email already exists" }; // Trả về lỗi nếu email tồn tại
    }

    // Hash mật khẩu và tạo người dùng mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      role,
    });
    return { EC: 0, EM: "User created successfully", data: newUser };
  } catch (error) {
    console.error("Error in createUserService:", error);
    return { EC: 3, EM: "Error creating user" };
  }
};

const deleteUserService = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User not found" };
    }

    // Delete user avatar
    // Xóa avatar của user nếu có
    if (
      user.avatarPath &&
      fs.existsSync(path.resolve(__dirname, "../uploads", user.avatarPath))
    ) {
      const avatarPath = path.resolve(__dirname, "../uploads", user.avatarPath); // Đảm bảo đường dẫn chính xác
      try {
        fs.unlinkSync(avatarPath);
        //console.log(`Deleted avatar file at ${avatarPath}`);
      } catch (error) {
        console.error("Error deleting avatar:", error);
      }
    } else {
      console.log("Avatar file not found or already deleted:", user.avatarPath);
    }

    // Find and delete playlists and their thumbnails
    const playlists = await Playlist.findAll({ where: { accountId: user.id } });
    for (const playlist of playlists) {
      if (playlist.thumbnailPath && fs.existsSync(playlist.thumbnailPath)) {
        fs.unlinkSync(playlist.thumbnailPath);
      }
    }
    await Playlist.destroy({ where: { accountId: user.id } });

    // Find and delete albums and their thumbnails
    const albums = await Album.findAll({ where: { accountId: user.id } });
    for (const album of albums) {
      if (album.thumbnailPath && fs.existsSync(album.thumbnailPath)) {
        fs.unlinkSync(album.thumbnailPath);
      }
    }
    await Album.destroy({ where: { accountId: user.id } });

    // Find and delete music files
    const musics = await Music.findAll({ where: { accountId: user.id } });
    for (const music of musics) {
      if (music.filePath && fs.existsSync(music.filePath)) {
        fs.unlinkSync(music.filePath);
      }
      if (music.thumbnailPath && fs.existsSync(music.thumbnailPath)) {
        fs.unlinkSync(music.thumbnailPath);
      }
    }
    await Music.destroy({ where: { accountId: user.id } });

    // Finally, delete the user account
    await User.destroy({ where: { email } });

    return { EC: 0, EM: "Account and related files deleted successfully" };
  } catch (error) {
    console.error("Error in deleteUserService:", error);
    return { EC: 3, EM: "Error deleting account and related files" };
  }
};

module.exports = {
  createUserService,
  deleteUserService,
};
