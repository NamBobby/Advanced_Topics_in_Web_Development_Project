const { uploadMusicService } = require('../services/artistService');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload music function
const uploadMusical = [upload.single('musicFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, artist, genre, album, publishedYear, author, description } = req.body; // Đảm bảo thêm description ở đây

        if (!title || !artist || !genre || !publishedYear) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const filePath = req.file.path;
        console.log("Uploading music with data:", { title, artist, genre, album, filePath, publishedYear, description });

        const music = await uploadMusicService({
            title,
            artist,
            genre,
            album,
            filePath,
            publishedYear,
            description,
            uploadDate: new Date()
        });

        res.status(201).json({ message: 'Music uploaded successfully', music });
    } catch (error) {
        console.error("Error in uploadMusical:", error); 
        res.status(500).json({ message: 'Error uploading music' });
    }
}];

module.exports = { uploadMusical };
