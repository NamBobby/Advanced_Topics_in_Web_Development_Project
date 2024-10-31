const express = require('express');
const { UserRegister, handleLogin, updateUser, updatePassword, getAccount, sendOtp, verifyOtp, createPlaylist, addMusicToPlaylist, removeMusicFromPlaylist, deletePlaylist } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delaymodule = require('../middleware/delay');
const { createUser, deleteUser, getUser } = require('../controllers/AdminController');
const { SendEmail } = require('../controllers/mailController');
const { getHomepage } = require('../controllers/homeController');
const { uploadMusical, createAlbum, addMusicToAlbum, removeMusicFromAlbum, deleteAlbum} = require('../controllers/artistController');


const routerAPI = express.Router();

routerAPI.all("*", auth);
routerAPI.get("/", getHomepage);


// Admin routes
routerAPI.post("/createuser", createUser);
routerAPI.post("/deleteaccount", deleteUser);
routerAPI.get("/user", getUser);

// Artist routes
routerAPI.post("/upload-music", uploadMusical);
routerAPI.post("/create-album", createAlbum);
routerAPI.post("/add-music-to-album", addMusicToAlbum);
routerAPI.post("/remove-music-from-album", removeMusicFromAlbum);
routerAPI.post("/delete-album", deleteAlbum);

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
routerAPI.post("/add-music-to-playlist", addMusicToPlaylist);
routerAPI.post("/remove-music-from-playlist", removeMusicFromPlaylist);
routerAPI.post("/delete-playlist", deletePlaylist);

module.exports = routerAPI; //export default