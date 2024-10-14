const { createUserService, loginService, getUserService, updateUserService, updatePasswordService, generateOtp, verifyOtpAndUpdatePassword } = require("../services/userService");

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

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const data = await generateOtp(email);
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword, confirmPassword} = req.body;
  const data = await verifyOtpAndUpdatePassword(email, otp, newPassword, confirmPassword);
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};

const getAccount = async(req, res) => {
  const data = await getUserService();
  return res.status(200).json(req.user)
}

module.exports = {
    UserRegister,
    handleLogin,
    getUser,
    getAccount,
    updateUser,
    updatePassword,
    sendOtp,
    verifyOtp,
}