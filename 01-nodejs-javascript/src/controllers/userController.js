const { createUserService, loginService, getUserService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password, dateOfBirth, gender } = req.body;
    const data = await createUserService(name, email, password, dateOfBirth, gender);
    if (data.EC !== 0) {
      return res.status(400).json(data);
    }
    return res.status(200).json(data);
  }
  

const handleLogin = async(req, res) => {
    const {email, password} = req.body;
    const data = await loginService(email, password)

    return res.status(200).json(data)
    
}

const getUser = async(req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}

const getAccount = async(req, res) => {
    const data = await getUserService();
    return res.status(200).json(req.user)
}

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount,
}