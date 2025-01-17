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
  UserFollow,
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

    const existingName = await Account.findOne({ where: {name} });
    if (existingName) {
      return { EC: 1, EM: "Username already exists" };
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
    const user = await Account.findOne({ where: { accountId } });
    if (!user) {
      return { EC: 1, EM: "Account not found" };
    }

    if (
      user.avatarPath &&
      fs.existsSync(path.resolve(__dirname, "../uploads", user.avatarPath))
    ) {
      const avatarPath = path.resolve(__dirname, "../uploads", user.avatarPath);
      try {
        fs.unlinkSync(avatarPath);
      } catch (error) {
        console.error("Error deleting avatar:", error);
      }
    } else {
      console.log("Avatar file not found or already deleted:", user.avatarPath);
    }

    if (user.role === "Artist") {
      const artist = await Artist.findOne({ where: { accountId } });

      // Delete all userfollows referencing this artist
      await UserFollow.destroy({ where: { artistId: artist.accountId } });

      // Delete all albums and their thumbnails
      const albums = await Album.findAll({
        where: { accountId: artist.accountId },
      });
      for (const album of albums) {
        await UserFollow.destroy({ where: { albumId: album.albumId } });
        if (album.thumbnailPath && fs.existsSync(album.thumbnailPath)) {
          fs.unlinkSync(album.thumbnailPath);
        }
        await Album.destroy({ where: { albumId: album.albumId } });
      }

      // Delete all music and their files
      const musics = await Music.findAll({
        where: { accountId: artist.accountId },
      });
      for (const music of musics) {
        if (music.filePath && fs.existsSync(music.filePath)) {
          fs.unlinkSync(music.filePath);
        }
        if (music.thumbnailPath && fs.existsSync(music.thumbnailPath)) {
          fs.unlinkSync(music.thumbnailPath);
        }
        await Music.destroy({ where: { musicId: music.musicId } });
      }

      // Delete the artist record
      await Artist.destroy({ where: { accountId: artist.accountId } });
    }

    // Delete playlists if the user has any
    const playlists = await Playlist.findAll({
      where: { accountId: user.accountId },
    });
    for (const playlist of playlists) {
      if (playlist.thumbnailPath && fs.existsSync(playlist.thumbnailPath)) {
        fs.unlinkSync(playlist.thumbnailPath);
      }
      await Playlist.destroy({ where: { playlistId: playlist.playlistId } });
    }

    // Finally, delete the account
    await Account.destroy({ where: { accountId } });

    return { EC: 0, EM: "Account and related data deleted successfully" };
  } catch (error) {
    console.error("Error in deleteAccountService:", error);
    return { EC: 3, EM: "Error deleting account and related data" };
  }
};

module.exports = {
  createAccountService,
  deleteAccountService,
};
