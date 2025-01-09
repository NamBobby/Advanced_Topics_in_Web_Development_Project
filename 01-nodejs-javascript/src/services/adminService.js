require("dotenv").config();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const {
  Account,
  User,
  Artist,
  Administrator,
  Playlist,
  Album,
  Music,
} = require("../models/associations");
const saltRounds = 10;

const createAccountService = async ({
  name,
  email,
  password,
  dateOfBirth,
  gender,
  role,
}) => {
  try {
    if (!["User", "Artist", "Administrator"].includes(role)) {
      return { EC: 1, EM: "Invalid role provided" };
    }

    // Check if the email already exists
    const existingAccount = await Account.findOne({ where: { email } });
    if (existingAccount) {
      return { EC: 1, EM: "Email already exists" };
    }

    // Create account in `accounts` table
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await Account.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      role,
    });

    // Add the account to the respective role-specific table
    if (role === "User") {
      await User.create({ accountId: newAccount.accountId });
    } else if (role === "Artist") {
      await Artist.create({ accountId: newAccount.accountId });
    } else if (role === "Administrator") {
      await Administrator.create({ accountId: newAccount.accountId });
    }

    return {
      EC: 0,
      EM: `${role} account created successfully`,
      data: newAccount,
    };
  } catch (error) {
    console.error("Error in createAccountService:", error);
    return { EC: 3, EM: "Error creating account" };
  }
};

const deleteAccountService = async (accountId) => {
  try {
    // Find the user by email
    const user = await Account.findOne({ where: { accountId } });
    if (!user) {
      return { EC: 1, EM: "Account not found" };
    }

    // Delete user avatar
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
    const playlists = await Playlist.findAll({
      where: { accountId: user.accountId },
    });
    for (const playlist of playlists) {
      if (playlist.thumbnailPath && fs.existsSync(playlist.thumbnailPath)) {
        fs.unlinkSync(playlist.thumbnailPath);
      }
    }

    // Finally, delete the user account

    if (user.role === "Administrator") {
      await Administrator.destroy({ where: { accountId: accountId } });
    } else if (user.role === "Artist") {
      const artist = await Artist.findOne({ where: { accountId } });
      // Find and delete albums and their thumbnails
      const albums = await Album.findAll({
        where: { artistId: artist.artistId },
      });
      for (const album of albums) {
        if (album.thumbnailPath && fs.existsSync(album.thumbnailPath)) {
          fs.unlinkSync(album.thumbnailPath);
        }
      }

      // Find and delete music files
      const musics = await Music.findAll({
        where: { artistId: artist.artistId },
      });
      for (const music of musics) {
        if (music.filePath && fs.existsSync(music.filePath)) {
          fs.unlinkSync(music.filePath);
        }
        if (music.thumbnailPath && fs.existsSync(music.thumbnailPath)) {
          fs.unlinkSync(music.thumbnailPath);
        }
      }

      await Artist.destroy({ where: { accountId: accountId } });
    } 
    
    await Account.destroy({ where: { accountId } });

    return { EC: 0, EM: "Account and related files deleted successfully" };
  } catch (error) {
    console.error("Error in deleteUserService:", error);
    return { EC: 3, EM: "Error deleting account and related files" };
  }
};

module.exports = {
  createAccountService,
  deleteAccountService,
};
