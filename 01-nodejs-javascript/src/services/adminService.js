require("dotenv").config();
const Account = require("../models/account");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createUserService = async (
  name,
  email,
  password,
  dateOfBirth,
  gender,
  role
) => {
  try {
    // Check admin existence
    const admin = await Account.findOne({ where: { email } });
    if (admin) {
      console.log(`>>> admin exists, use another email: "${email}"`);
      return null;
    }

    // Hash admin password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // Save admin to database
    let result = await Account.create({
      name,
      email,
      password: hashPassword,
      dateOfBirth,
      gender,
      role,
    });
    return result;
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error creating account" };
  }
};

const deleteUserService = async (email) => {
  try {
    // Find the user by email
    const user = await Account.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User  not found" };
    }

    // Delete the user
    await Account.destroy({ where: { email } });
    return { EC: 0, EM: "Account deleted successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error deleting account" };
  }
};


module.exports = {
  createUserService,
  deleteUserService,
};
