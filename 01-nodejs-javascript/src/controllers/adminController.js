const { createAccountService, deleteAccountService } = require("../services/adminService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, gender, role } = req.body;
    const result = await createAccountService({ name, email, password, dateOfBirth, gender, role });

    if (result.EC === 0) {
      return res.status(201).json({ message: result.EM, data: result.data });
    } else {
      return res.status(400).json({ message: result.EM });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

  
const deleteUser = async (req, res) => {
  try {
    const { accountId } = req.body;
    const result = await deleteAccountService(accountId);

    if (result.EC !== 0) {
      return res.status(400).json({ message: result.EM });
    }

    return res.status(200).json({ message: result.EM });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
};


module.exports = {
    createUser,
    deleteUser,
}