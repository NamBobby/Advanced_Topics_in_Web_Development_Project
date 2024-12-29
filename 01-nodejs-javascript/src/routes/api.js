const express = require("express");
const {
  UserRegister,
  handleLogin,
  updateUser,
  updatePassword,
  getAccount,
  sendOtp,
  verifyOtp,
  createPlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  deletePlaylist,
  getPlaylists,
  getMusics,
  getMusicInPlaylist,
  getMusicInAlbum,
  searchMusic,
  getUser,
  getAlbums,
  followItem,
  getFollowedItems,
  unfollowItem
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delaymodule = require("../middleware/delay");

const { upload } = require("../config/multerConfig");

const { SendEmail } = require("../controllers/mailController");
const { getHomepage } = require("../controllers/homeController");
const {
  uploadMusical,
  createAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
  deleteAlbum,
  deleteMusic,
} = require("../controllers/artistController");
const { createUser, deleteUser } = require("../controllers/adminController");


const routerAPI = express.Router();

routerAPI.all("*", auth);
routerAPI.get("/", getHomepage);

// Admin routes
routerAPI.post("/createuser", delaymodule, createUser);
routerAPI.post("/deleteaccount", deleteUser);


// Artist routes
routerAPI.post("/upload-music", delaymodule, uploadMusical);
routerAPI.post("/create-album", createAlbum);
routerAPI.delete('/music/:id', deleteMusic);
routerAPI.post("/add-music-to-album", addMusicToAlbum);
routerAPI.post("/remove-music-from-album", removeMusicFromAlbum);
routerAPI.delete("/delete-album/:id", deleteAlbum);

// User routes
routerAPI.post("/register",delaymodule, UserRegister);
routerAPI.post("/login",delaymodule, handleLogin);
routerAPI.get("/account", delaymodule, getAccount);
routerAPI.post("/sendotp",delaymodule, sendOtp);
routerAPI.post("/verifyotp", delaymodule, verifyOtp);
routerAPI.post("/sendemail", SendEmail);
routerAPI.patch("/profile", upload, delaymodule, updateUser);
routerAPI.patch("/password", delaymodule, updatePassword);
routerAPI.post("/create-playlist", createPlaylist);
routerAPI.get("/playlists",delaymodule, getPlaylists);
routerAPI.get("/musics",delaymodule, getMusics);
routerAPI.get("/albums",delaymodule, getAlbums);
routerAPI.post("/add-music-to-playlist", addMusicToPlaylist);
routerAPI.post("/remove-music-from-playlist", removeMusicFromPlaylist);
routerAPI.delete("/delete-playlist/:id", deletePlaylist);
routerAPI.post("/playlists/music",delaymodule, getMusicInPlaylist);
routerAPI.post("/albums/music", delaymodule, getMusicInAlbum);
routerAPI.post("/search/music",delaymodule, searchMusic);
routerAPI.get("/user", getUser);
routerAPI.post("/follow",delaymodule, followItem);
routerAPI.get("/followed-items", getFollowedItems);
routerAPI.post("/unfollow",delaymodule, unfollowItem);

module.exports = routerAPI; //export default
