require("dotenv").config();
const User = require("../models/Account");
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const mailService = require('../services/mailService');
const UserOTPVerification = require("../models/UserOTPVerification");

const createUserService = async (name, email, password, dateOfBirth, gender) => {
    try {
        // Check user existence
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`>>> user exists, use another email: "${email}"`);
            return null;
        }

        // Hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);
        // Save user to database
        let result = await User.create({
            name,
            email,
            password: hashPassword,
            dateOfBirth,
            gender,
            role: 'User '
        });
        return result;

    } catch (error) {
        console.log(error);
        return { EC: 3, EM: "Error creating user" };
    }
};

const loginService = async (email, password) => {
    try {
        // Fetch user by email
        const user = await User.findOne({ where: { email } });
        if (user) {
            // Compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password errors"
                };
            } else {
                // Create an access token
                const payload = {
                    email: user.email,
                    name: user.name,
                    role: user.role
                };

                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                );
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password errors"
            };
        }

    } catch (error) {
        console.log(error);
        return { EC: 4, EM: "Error logging in" };
    }
};

const getUserService = async () => {
    try {
        let result = await User.findAll({ attributes: { exclude: ['password'] } });
        return result;

    } catch (error) {
        console.log(error);
        return { EC: 5, EM: "Error fetching users" };
    }
};

const updateUserService = async(id, dateOfBirth, gender) => {
    try {
        // Fetch user by ID
        const user = await User.findByPk(id);
        if (!user) {
          return { EC: 6, EM: "User   not found" };
        }
    
        // Update date of birth
        user.dateOfBirth = dateOfBirth;
    
        // Update gender
        user.gender = gender;
    
        await user.save();
    
        return { EC: 0, EM: "Profile updated successfully" };
      } catch (error) {
        console.log(error);
        return { EC: 7, EM: "Error updating profile" };
      }
};

const updatePasswordService = async (id, password, newPassword, confirmPassword) => {
    try {
      // Fetch user by ID
      const user = await User.findByPk(id);
      if (!user) {
        return { EC: 6, EM: "User  not found" };
      }
  
      // Check if current password is correct
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { EC: 7, EM: "Invalid current password" };
      }
  
      // Check if new password and confirmation match
      if (newPassword !== confirmPassword) {
        return { EC: 8, EM: "New password and confirmation do not match" };
      }
  
      // Update password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      return { EC: 0, EM: "Password updated successfully" };
    } catch (error) {
      console.log(error);
      return { EC: 9, EM: "Error updating password" };
    }
  };

const generateOtp = async (email) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { EC: 1, EM: "User   not found" };
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp.toString(), saltRounds);

    // Check if an OTP verification record already exists
    const existingOTPVerification = await UserOTPVerification.findOne({ where: { email } });
    if (existingOTPVerification) {
      // Update the existing record
      existingOTPVerification.otp = hashedOTP;
      existingOTPVerification.createdAt = Date.now();
      existingOTPVerification.expiresAt = Date.now() + 180000;
      await existingOTPVerification.save();
    } else {
      // Create a new OTP verification record
      const newOTPVerification = await UserOTPVerification.create({
        email, // Include the email value here
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 180000,
      });
      await newOTPVerification.save();
    }

    // Send the OTP to the user's email
    await mailService.sendOTP(email, otp);

    return { EC: 0, EM: `OTP: ${otp} sent successfully` };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error sending OTP" };
  }
};

  const verifyOtpAndUpdatePassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return { EC: 1, EM: "User not found" };
      }
  
      // Verify the OTP
      const existingOTPVerification = await UserOTPVerification.findOne({ where: { email } });
      if (!existingOTPVerification) {
        return { EC: 2, EM: "OTP not found" };
      }
  
      const isMatchOtp = await bcrypt.compare(otp.toString(), existingOTPVerification.otp);
      if (!isMatchOtp) {
        return { EC: 2, EM: "Invalid OTP" };
      }
  
      // Update the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();  
      return { EC: 0, EM: "Password updated successfully" };
    } catch (error) {
      console.log(error);
      return { EC: 3, EM: "Error updating password" };
    }
  };

module.exports = {
    createUserService, loginService, getUserService, updateUserService, updatePasswordService, generateOtp, verifyOtpAndUpdatePassword,
}