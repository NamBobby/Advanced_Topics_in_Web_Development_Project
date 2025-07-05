const jwt = require("jsonwebtoken");
const { Account } = require("../models/associations");

const auth = async (req, res, next) => {
  const allow_lists = [
    "/",
    "/register",
    "/user",
    "/login",
    "/sendemail",
    "/sendotp",
    "/verifyotp",
    "/musics",
    "/albums/artist",
    "/albums/music",
    "/search/music",
    "/albums",
  ];

  const fullAllowList = allow_lists.map((item) => `/v1/api${item}`);
  if (fullAllowList.some((path) => req.originalUrl.startsWith(path))) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        // Debug: Log JWT_SECRET exists
        console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET?.length);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Debug: Log decoded token
        console.log('🔓 Decoded token:', decoded);
        console.log('🔓 Looking for accountId:', decoded.accountId);

        const user = await Account.findOne({
          where: { accountId: decoded.accountId },
        });
        
        // Debug: Log user query result
        console.log('👤 User found:', !!user);
        console.log('👤 User data:', user ? { id: user.accountId, email: user.email } : 'null');
        
        if (!user) {
          console.log('❌ Account not found for accountId:', decoded.accountId);
          return res.status(401).json({ 
            success: false,
            message: "Account not found" 
          });
        }

        req.user = {
          accountId: user.accountId,
          email: user.email,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          avatarPath: user.avatarPath,
          gender: user.gender,
          role: user.role,
        };

        console.log("✅ Auth successful for user:", user.email);
        next();
      } catch (error) {
        console.log('❌ JWT Error:', error.message);
        console.log('❌ JWT Error type:', error.name);
        return res.status(401).json({ 
          success: false,
          message: "TokenExpired/Error" 
        });
      }
    } else {
      console.log('❌ No authorization header');
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }
  }
};

module.exports = auth;