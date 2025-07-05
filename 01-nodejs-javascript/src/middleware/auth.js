const jwt = require("jsonwebtoken");
const { Account } = require("../models/associations");

const auth = async (req, res, next) => {
  const allow_lists = [
    "/",
    "/register",
    "/user",
    "/login",
    "/account",
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
  
  // Check if endpoint is in allow list
  if (fullAllowList.some((path) => req.originalUrl.startsWith(path))) {
    return next();
  }

  // Check authorization header
  if (!req.headers || !req.headers.authorization) {
    console.log('❌ No authorization header for:', req.originalUrl);
    return res.status(401).json({ 
      success: false,
      message: "Authentication required" 
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith('Bearer ')) {
    console.log('❌ Invalid auth header format for:', req.originalUrl);
    return res.status(401).json({ 
      success: false,
      message: "Invalid authorization format" 
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log('❌ No token provided for:', req.originalUrl);
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    // Verify JWT
    console.log('🔑 Verifying token for:', req.originalUrl);
    console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT decoded successfully:', { 
      accountId: decoded.accountId, 
      email: decoded.email,
      exp: new Date(decoded.exp * 1000).toISOString()
    });

    // Find user in database
    console.log('🔍 Looking for user with accountId:', decoded.accountId);
    
    // Try multiple query methods to ensure success
    let user = null;
    
    try {
      // Method 1: Standard findOne
      user = await Account.findOne({
        where: { accountId: decoded.accountId }
      });
      console.log('📊 Method 1 result:', !!user);
    } catch (error1) {
      console.log('❌ Method 1 failed:', error1.message);
      
      try {
        // Method 2: findByPk
        user = await Account.findByPk(decoded.accountId);
        console.log('📊 Method 2 result:', !!user);
      } catch (error2) {
        console.log('❌ Method 2 failed:', error2.message);
        
        try {
          // Method 3: Raw query
          const [results] = await Account.sequelize.query(
            'SELECT * FROM public.accounts WHERE account_id = ?',
            {
              replacements: [decoded.accountId],
              type: Account.sequelize.QueryTypes.SELECT
            }
          );
          if (results.length > 0) {
            user = {
              accountId: results[0].account_id,
              email: results[0].email,
              name: results[0].name,
              dateOfBirth: results[0].date_of_birth,
              avatarPath: results[0].avatar_path,
              gender: results[0].gender,
              role: results[0].role
            };
          }
          console.log('📊 Method 3 result:', !!user);
        } catch (error3) {
          console.log('❌ Method 3 failed:', error3.message);
        }
      }
    }

    if (!user) {
      console.log('❌ User not found for accountId:', decoded.accountId);
      return res.status(401).json({ 
        success: false,
        message: "Account not found in database" 
      });
    }

    // Set user in request
    req.user = {
      accountId: user.accountId,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      avatarPath: user.avatarPath,
      gender: user.gender,
      role: user.role,
    };

    console.log('✅ Auth successful for:', user.email, 'Role:', user.role);
    next();

  } catch (error) {
    console.log('❌ JWT verification failed:', error.message);
    console.log('❌ Error type:', error.name);
    console.log('❌ Full error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: "Token verification failed" 
      });
    }
  }
};

module.exports = auth;