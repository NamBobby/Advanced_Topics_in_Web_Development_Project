const User = require("../models/user");
const bcrypt = require('bcrypt')
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        //hashuser password 
        const hashPassword = await bcrypt.hash(password, saltRounds)
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "BOBBY"
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        //fetch user by email 
        const user = await User.findOne({ email: email});
        if (user){
            //compare password
            console.log(">>> check user: ", user)
            const isMatchPassword = await bcrypt.compare(password, user.password)
            if(!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password errors"
                }
            }else {
                //create an access token
                return "create an access token"; 
            }
        }else {
            return {
                EC: 1,
                EM: "Email/Password errors"
            }
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}





module.exports = {
    createUserService, loginService
}