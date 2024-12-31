require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const { connectToDatabase, sequelize } = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");
const path = require("path");
const { deleteSpecificFiles } = require("./utils/cleanfileutils");

// Import models with associations
const {
  User,
  Album,
  Music,
  Playlist,
  PlaylistMusic,
  UserFollow
} = require("./models/associations");

const app = express();
const port = process.env.PORT || 8888;

// Config CORS
app.use(cors());

// Config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config template engine
configViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getHomepage);

// Define route
app.use("/", webAPI);
app.use("/v1/api/", apiRoutes);

// Cấu hình phục vụ tệp tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Seed initial data function
const seedInitialUsers = async () => {
  const initialUsers = [
    {
      name: "bobby",
      email: "bobby@gmail.com",
      password: "$2b$10$YasRkHlmDIBrXNe12NwvoOpcdw8FPEc3/mQOBzhUCjuC1BhPhTA.6", // Hashed password
      dateOfBirth: "2001-05-01",
      gender: "Man",
      role: "Administrator",
    },
    {
      name: "Son Tung MTP",
      email: "nguyenthanhtung@example.com",
      password: "$2b$10$9wJS51sjOLp/CSo5d8N0g.ABfydK3q0lsOgRDm8DVCXmc4bfw/XMe", // Hashed password
      dateOfBirth: "1994-07-05",
      gender: "Man",
      role: "Artist",
    },
    // Add more initial users as needed
  ];
  try {
    await User.bulkCreate(initialUsers, { ignoreDuplicates: true }); // Use ignoreDuplicates to skip existing entries
    console.log("Initial users seeded successfully.");
  } catch (error) {
    console.error("Error seeding initial users:", error);
  }
};

// Sync models and connect to the database
(async () => {
  try {
    await connectToDatabase();

    const shouldForceSync = false; //set your condition here
    if (shouldForceSync) {
      const uploadsPath = path.join(__dirname, "uploads"); 
      const fileTypesToDelete = [".mp3", ".jpeg", ".mpeg", ".png", ".webp", ".aac", ".jpg"];
      deleteSpecificFiles(uploadsPath, fileTypesToDelete);
      // Tạo lại thư mục uploads
      await sequelize.sync({ force: true }); // Drop existing tables and recreate
    } else {
      await sequelize.sync();
    } // Sync all Sequelize models with the database
    // Seed initial users after tables are created
    await seedInitialUsers();
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connecting to DB: ", error);
  }
})();
