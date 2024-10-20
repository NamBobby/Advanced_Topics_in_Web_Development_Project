require("dotenv").config()
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    
    const allow_lists = ["/", "/register", "/login", "/sendemail", "/sendotp", "/verifyotp", "/createuser"];

    if(allow_lists.find(item => '/v1/api' + item === req.originalUrl)){
        next();
    }else {
        if ( req.headers && req.headers.authorization){
        // if ( req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    dateOfBirth: decoded.dateOfBirth,
                    gender: decoded.gender,
                    role: decoded.role
                }
                console.log(">>> check token: ", decoded)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "TokenExpired/Error"
                })
            }
            
        } else {
            return res.status(401).json({
                message: "Unknown Authorized"
            })
        }
    }            
}

module.exports = auth;