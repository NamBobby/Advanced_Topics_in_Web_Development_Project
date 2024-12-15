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
  getUserAlbums,
  getMusicInAlbum,
  searchMusic,
  getUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delaymodule = require("../middleware/delay");

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
routerAPI.post("/createuser", createUser);
routerAPI.post("/deleteaccount", deleteUser);


// Artist routes
routerAPI.post("/upload-music", uploadMusical);
routerAPI.post("/create-album", createAlbum);
routerAPI.delete('/music/:id', deleteMusic);
routerAPI.post("/add-music-to-album", addMusicToAlbum);
routerAPI.post("/remove-music-from-album", removeMusicFromAlbum);
routerAPI.delete("/delete-album/:id", deleteAlbum);

// User routes
routerAPI.post("/register", UserRegister);
routerAPI.post("/login", handleLogin);
routerAPI.get("/account", delaymodule, getAccount);
routerAPI.post("/sendotp", sendOtp);
routerAPI.post("/verifyotp", delaymodule, verifyOtp);
routerAPI.post("/sendemail", SendEmail);
routerAPI.patch("/profile/:id", delaymodule, updateUser);
routerAPI.patch("/profile/:id/password", delaymodule, updatePassword);
routerAPI.post("/create-playlist", createPlaylist);
routerAPI.get("/playlists", getPlaylists);
routerAPI.get("/musics", getMusics);
routerAPI.post("/add-music-to-playlist", addMusicToPlaylist);
routerAPI.post("/remove-music-from-playlist", removeMusicFromPlaylist);
routerAPI.delete("/delete-playlist/:id", deletePlaylist);
routerAPI.post("/playlists/music", getMusicInPlaylist);
routerAPI.post("/albums/artist", getUserAlbums);
routerAPI.post("/albums/music", getMusicInAlbum);
routerAPI.post("/search/music", searchMusic);
routerAPI.get("/user", getUser);

module.exports = routerAPI; //export default
