const express = require('express');
const { UserRegister, handleLogin, getUser, updateUser, updatePassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delaymodule = require('../middleware/delay');
const { getAccount, createUser, deleteUser } = require('../controllers/AdminController');


const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", UserRegister);
routerAPI.post("/createuser", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/deleteaccount", deleteUser);



routerAPI.get("/user", getUser);
routerAPI.get("/account", delaymodule, getAccount);

routerAPI.patch("/profile/:id", delaymodule, updateUser);
routerAPI.patch("/profile/:id/password", delaymodule, updatePassword);


module.exports = routerAPI; //export default