require("dotenv").config();
const Admin = require("../models/Account");
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const createUserService = async (name, email, password, dateOfBirth, gender) => {
    try {
        // Check admin existence
        const admin = await Admin.findOne({ where: { email } });
        if (admin) {
            console.log(`>>> admin exists, use another email: "${email}"`);
            return null;
        }

        // Hash admin password
        const hashPassword = await bcrypt.hash(password, saltRounds);
        // Save admin to database
        let result = await Admin.create({
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
        return { EC: 3, EM: "Error creating admin" };
    }
};

const deleteUserService = async (email) => {
    try {
      // Find the user by email
      const user = await Admin.findOne({ where: { email } });
      if (!user) {
        return { EC: 1, EM: "User  not found" };
      }
  
      // Delete the user
      await user.destroy();
      return { EC: 0, EM: "Account deleted successfully" };
    } catch (error) {
      console.log(error);
      return { EC: 3, EM: "Error deleting account" };
    }
  };


module.exports = {
    createUserService, deleteUserService
}