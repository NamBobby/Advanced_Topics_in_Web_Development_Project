const { uploadMusicService } = require('../services/artistService'); // Import the music service
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage });


// Upload music function
const uploadMusic = [upload.single('musicFile'), async (req, res) => {
    try {
        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Destructure the body to get music details
        const { title, artist, genre, album, publishedYear } = req.body;

        // Validate required fields
        if (!title || !artist || !genre || !publishedYear) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const filePath = req.file.path; // Path to the uploaded file

        const music = await uploadMusicService({
            title,
            artist,
            genre,
            album,
            filePath,
            publishedYear,
            author,
            uploadDate: new Date() // Set the current date
        });

        res.status(201).json({ message: 'Music uploaded successfully', music });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading music' });
    }
}];

module.exports = { uploadMusic };