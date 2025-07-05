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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Account.findOne({
          where: { accountId: decoded.accountId },
        });
        if (!user) {
          return res.status(401).json({ message: "Account not found" });
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

        //console.log(">>> check auth: ", req.user);
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
