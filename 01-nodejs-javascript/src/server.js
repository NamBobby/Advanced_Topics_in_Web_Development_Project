require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const { connectToDatabase, sequelize } = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("./models/associations");

const app = express();
const port = process.env.PORT || 8888;

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS check - Origin:', origin, 'Expected:', process.env.CORS_ORIGIN);
    
    // Allow requests with no origin (mobile apps, postman)
    if (!origin) return callback(null, true);
    
    if (origin === process.env.CORS_ORIGIN) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
configViewEngine(app);

// Routes
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);
app.use("/v1/api/", apiRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Function to initialize DB from SQL file
const processAndRunSQLFile = async (filePath) => {
  try {
    let sql = fs.readFileSync(filePath, "utf8");

    sql = sql
      .replace(/\\r\\n/g, "\n")
      .replace(/\\\\/g, "\\")
      .replace(/\\/g, "/")
      .replace(/--.*?(\r?\n|$)/g, "")
      .replace(/\/\*.*?\*\//gs, "");

    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const stmt of statements) {
      await sequelize.query(stmt);
    }

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Function to check if required tables exist in PostgreSQL
const checkAndInitializeDatabase = async (sqlFilePath) => {
  try {
    const tables = ["accounts", "administrators", "albums", "artists", "music"];
    const missingTables = [];

    for (const table of tables) {
      const [result] = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${table}'`
      );
      if (result.length === 0) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.warn(
        `Missing tables: ${missingTables.join(", ")}. Reinitializing database...`
      );
      await processAndRunSQLFile(sqlFilePath);
    } else {
      console.log("All required tables are present.");
    }
  } catch (error) {
    console.error("Error checking database tables:", error);
    throw error;
  }
};

// Main server runner
(async () => {
  try {
    await connectToDatabase();

    const shouldForceSync = false;
    const sqlFilePath = path.join(__dirname, "config", "Database.sql");

    if (shouldForceSync) {
      await sequelize.sync({ alter: true });
      await processAndRunSQLFile(sqlFilePath);
    } else {
      await checkAndInitializeDatabase(sqlFilePath);
    }

    app.listen(port, () => {
      console.log(`Backend Node.js App is running on port ${port}`);
    });
  } catch (error) {
    console.error(">>> Error connecting to DB:", error);
  }
})();
