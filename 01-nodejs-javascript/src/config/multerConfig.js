const multer = require("multer");
const crypto = require("crypto");
const supabase = require('./supabase');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter (same logic as before)
const fileFilter = (req, file, cb) => {
  const allowedMusicTypes = ["audio/mp3", "audio/mpeg", "audio/aac"];
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.fieldname === "musicFile" && !allowedMusicTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect music file type");
    error.status = 400;
    return cb(error, false);
  }

  if (["avatar", "thumbnail", "albumThumbnail", "playlistThumbnail"].includes(file.fieldname) && !allowedImageTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect image file type");
    error.status = 400;
    return cb(error, false);
  }

  cb(null, true);
};

// Upload to memory first
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB max
  },
}).fields([
  { name: "musicFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "albumThumbnail", maxCount: 1 },
  { name: "playlistThumbnail", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);

// Helper function to upload to Supabase Storage
const uploadToSupabase = async (file, bucketName, folderPath = '') => {
  try {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folderPath}${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      path: fileName,
      publicUrl: publicUrl
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};

// Helper function to delete from Supabase Storage
const deleteFromSupabase = async (bucketName, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    return false;
  }
};

const checkThumbnailSize = (req, res, next) => {
  if (req.files) {
    const files = ['albumThumbnail', 'playlistThumbnail', 'musicFile', 'avatar'];
    for (const fileType of files) {
      if (req.files[fileType] && req.files[fileType][0].size > 5 * 1024 * 1024) {
        return next(new Error(`${fileType} file size exceeds 5MB limit`));
      }
    }
  }
  next();
};

module.exports = { 
  upload, 
  checkThumbnailSize, 
  uploadToSupabase, 
  deleteFromSupabase 
};