const { createUserService, loginService, getUserService, updateUserService, updatePasswordService } = require("../services/userService");

const UserRegister = async (req, res) => {
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

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { dateOfBirth, gender} = req.body;
    const data = await updateUserService(id, dateOfBirth, gender);
    if (data.EC !== 0) {
      return res.status(400).json(data);
    }
    return res.status(200).json(data);
};

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const data = await updatePasswordService(id, currentPassword, newPassword, confirmPassword);
    if (data.EC !== 0) {
      return res.status(400).json(data);
    }
    return res.status(200).json(data);
  };

module.exports = {
    UserRegister,
    handleLogin,
    getUser,
    updateUser,
    updatePassword,
}