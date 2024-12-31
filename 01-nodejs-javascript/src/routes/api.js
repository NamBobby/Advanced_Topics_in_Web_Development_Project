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
routerAPI.post("/deleteaccount", delaymodule, deleteUser);


// Artist routes
routerAPI.post("/upload-music", delaymodule, uploadMusical);
routerAPI.post("/create-album", delaymodule, createAlbum);
routerAPI.delete('/music/:id', delaymodule, deleteMusic);
routerAPI.post("/add-music-to-album", delaymodule, addMusicToAlbum);
routerAPI.post("/remove-music-from-album", delaymodule, removeMusicFromAlbum);
routerAPI.delete("/delete-album/:id", delaymodule, deleteAlbum);

// User routes
routerAPI.post("/register",delaymodule, UserRegister);
routerAPI.post("/login",delaymodule, handleLogin);
routerAPI.get("/account", delaymodule, getAccount);
routerAPI.post("/sendotp",delaymodule, sendOtp);
routerAPI.post("/verifyotp", delaymodule, verifyOtp);
routerAPI.patch("/profile", upload, delaymodule, updateUser);
routerAPI.patch("/password", delaymodule, updatePassword);
routerAPI.post("/create-playlist",delaymodule, createPlaylist);
routerAPI.get("/playlists",delaymodule, getPlaylists);
routerAPI.get("/musics",delaymodule, getMusics);
routerAPI.get("/albums",delaymodule, getAlbums);
routerAPI.post("/add-music-to-playlist",delaymodule, addMusicToPlaylist);
routerAPI.post("/remove-music-from-playlist",delaymodule, removeMusicFromPlaylist);
routerAPI.delete("/delete-playlist/:id",delaymodule, deletePlaylist);
routerAPI.post("/playlists/music",delaymodule, getMusicInPlaylist);
routerAPI.post("/albums/music", delaymodule, getMusicInAlbum);
routerAPI.post("/search/music",delaymodule, searchMusic);
routerAPI.get("/user", delaymodule, getUser);
routerAPI.post("/follow",delaymodule, followItem);
routerAPI.get("/followed-items", getFollowedItems);
routerAPI.post("/unfollow",delaymodule, unfollowItem);

module.exports = routerAPI; //export default
