const { createUserService, deleteUserService, getUserService } = require("../services/adminService");

const createUser = async (req, res) => {
  const { name, email, password, dateOfBirth, gender, role } = req.body;

  const result = await createUserService(name, email, password, dateOfBirth, gender, role);

  if (result.EC === 1) {
    return res.status(400).json({ message: result.EM }); // Email đã tồn tại
  } else if (result.EC === 3) {
    return res.status(500).json({ message: result.EM }); // Lỗi server
  }

  return res.status(201).json({ message: result.EM, user: result.data });
};

  
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
    deleteUser,
}