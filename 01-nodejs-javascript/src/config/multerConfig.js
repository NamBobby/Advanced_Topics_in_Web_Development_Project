const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "musicFile") {
      cb(null, "./src/uploads/music/");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "./src/uploads/music/thumbnails/");
    } else if (file.fieldname === "albumThumbnail") {
      cb(null, "./src/uploads/albums");
    } else if (file.fieldname === "playlistThumbnail") {
      cb(null, "./src/uploads/playlists");
    } else {
      cb(new Error("Unknown fieldname"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMusicTypes = ["audio/mp3", "audio/mpeg", "audio/aac"];
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.fieldname === "musicFile" && !allowedMusicTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect music file type");
    error.status = 400;
    return cb(error, false);
  }

  if (["thumbnail", "albumThumbnail", "playlistThumbnail"].includes(file.fieldname) && !allowedImageTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect image file type");
    error.status = 400;
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB cho tệp nhạc
  },
}).fields([
  { name: "musicFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "albumThumbnail", maxCount: 1 },
  { name: "playlistThumbnail", maxCount: 1 }
]);

// Thêm chức năng middleware để kiểm tra riêng giới hạn kích thước tệp thumbnail
const checkThumbnailSize = (req, res, next) => {
  if (req.files) {
    if (req.files.albumThumbnail && req.files.albumThumbnail[0].size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "Album thumbnail file size exceeds 5MB limit" });
    }
    if (req.files.playlistThumbnail && req.files.playlistThumbnail[0].size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "Playlist thumbnail file size exceeds 5MB limit" });
    }
  }
  next();
};

module.exports = { upload, checkThumbnailSize };
