const { createUserService, deleteUserService, getUserService } = require("../services/adminService");

const createUser = async (req, res) => {
    const { name, email, password, dateOfBirth, gender, role } = req.body;
    const data = await createUserService(name, email, password, dateOfBirth, gender, role);
    if (data.EC !== 0) {
      return res.status(400).json(data);
    }
    return res.status(200).json(data);
}
  
const getUser = async(req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}

const deleteUser = async (req, res) => {
  const { email } = req.body;
  const data = await deleteUserService(email);
  if (data.EC !== 0) {
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
};


module.exports = {
    createUser,
    getUser,
    deleteUser,
}