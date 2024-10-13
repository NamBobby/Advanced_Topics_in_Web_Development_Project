require("dotenv").config();
const User = require("../models/user");
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
            gender
        });
        return result;

    } catch (error) {
        console.log(error);
        return { EC: 3, EM: "Error creating user" };
    }
}

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
                    name: user.name
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
                        name: user.name
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
}

const getUserService = async () => {
    try {
        let result = await User.findAll({ attributes: { exclude: ['password'] } });
        return result;

    } catch (error) {
        console.log(error);
        return { EC: 5, EM: "Error fetching users" };
    }
}

module.exports = {
    createUserService, loginService, getUserService
}