require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createUserService = async (name, email, password, dateOfBirth, gender, role) => {
  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { EC: 1, EM: "Email already exists" }; // Trả về lỗi nếu email tồn tại
    }

    // Hash mật khẩu và tạo người dùng mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      role,
    });
    return { EC: 0, EM: "User created successfully", data: newUser };
  } catch (error) {
    console.error("Error in createUserService:", error);
    return { EC: 3, EM: "Error creating user" }; // Trả về lỗi tổng quát
  }
};


const deleteUserService = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User  not found" };
    }

    // Delete the user
    await User.destroy({ where: { email } });
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
