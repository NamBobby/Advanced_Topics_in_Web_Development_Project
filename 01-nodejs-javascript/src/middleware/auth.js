const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const allow_lists = ["/", "/register", "/user", "/login", "/sendemail", "/sendotp", "/verifyotp", "/musics", "/albums/artist", "/albums/music", "/search/music"];

  if (allow_lists.find(item => '/v1/api' + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          avatarPath: user.avatarPath, 
          gender: user.gender,
          role: user.role,
        };

        console.log(">>> check auth: ", req.user);
        next();
      } catch (error) {
        return res.status(401).json({ message: "TokenExpired/Error" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  }
};

module.exports = auth;
