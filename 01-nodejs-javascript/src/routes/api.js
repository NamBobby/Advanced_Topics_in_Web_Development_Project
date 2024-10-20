const express = require('express');
const { UserRegister, handleLogin, updateUser, updatePassword, getAccount, sendOtp, verifyOtp } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delaymodule = require('../middleware/delay');
const { createUser, deleteUser, getUser } = require('../controllers/AdminController');
const { SendEmail } = require('../controllers/mailController');
const { getHomepage } = require('../controllers/homeController');
const { uploadMusic } = require('../controllers/artistController');

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", getHomepage);

routerAPI.post("/register", UserRegister);
routerAPI.post("/createuser", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/deleteaccount", deleteUser);
routerAPI.post("/sendotp", sendOtp);
routerAPI.post("/verifyotp", delaymodule, verifyOtp);
routerAPI.post("/sendemail", SendEmail);

routerAPI.post("/upload-music", uploadMusic);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delaymodule, getAccount);

routerAPI.patch("/profile/:id", delaymodule, updateUser);
routerAPI.patch("/profile/:id/password", delaymodule, updatePassword);

module.exports = routerAPI; //export default