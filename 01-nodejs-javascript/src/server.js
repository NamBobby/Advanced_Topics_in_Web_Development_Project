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

// Simple CORS setup using environment variables
const corsOptions = {
  origin: process.env.CORS_ORIGIN || false, // Chỉ cho phép origin từ env variable
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  optionsSuccessStatus: 200
};

// Log CORS origin for debugging
console.log('CORS origin:', process.env.CORS_ORIGIN || 'Not set');

app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// View engine setup
configViewEngine(app);

// Static file serving
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);
app.use("/v1/api/", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Enhanced database initialization with PostgreSQL compatibility
const processAndRunSQLFile = async (filePath) => {
  try {
    let sql = fs.readFileSync(filePath, "utf8");

    // Clean and process SQL for PostgreSQL
    sql = sql
      .replace(/\\r\\n/g, "\n")
      .replace(/\\\\/g, "\\")
      .replace(/\\/g, "/")
      .replace(/--.*?(\r?\n|$)/g, "")
      .replace(/\/\*.*?\*\//gs, "")
      // Convert MySQL syntax to PostgreSQL
      .replace(/AUTO_INCREMENT/g, "SERIAL")
      .replace(/ENGINE=InnoDB/g, "")
      .replace(/DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci/g, "")
      .replace(/`/g, '"') // Replace backticks with double quotes
      .replace(/INT NOT NULL AUTO_INCREMENT/g, "SERIAL")
      .replace(/TINYINT\(1\)/g, "BOOLEAN")
      .replace(/DATETIME/g, "TIMESTAMP")
      .replace(/enum\(/g, "VARCHAR(50) CHECK (value IN (")
      .replace(/\) NOT NULL/g, ")) NOT NULL");

    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const stmt of statements) {
      try {
        await sequelize.query(stmt);
      } catch (error) {
        console.warn(`Warning: Could not execute statement: ${stmt.substring(0, 100)}...`);
        console.warn(`Error: ${error.message}`);
      }
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
    console.log("Starting server...");
    
    // Check environment variables
    const requiredEnvVars = ['DB_HOST', 'DB_DATABASE_NAME', 'DB_USERNAME', 'DB_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing environment variables: ${missingVars.join(', ')}`);
      process.exit(1);
    }

    // Check CORS configuration
    if (!process.env.CORS_ORIGIN) {
      console.warn('CORS_ORIGIN not set in environment variables');
    } else {
      console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
    }

    await connectToDatabase();

    const shouldForceSync = process.env.FORCE_SYNC === 'true';
    const sqlFilePath = path.join(__dirname, "config", "Database.sql");

    if (shouldForceSync) {
      console.log("Force syncing database...");
      await sequelize.sync({ alter: true });
      await processAndRunSQLFile(sqlFilePath);
    } else {
      await checkAndInitializeDatabase(sqlFilePath);
    }

    app.listen(port, () => {
      console.log(`Spotify Clone Backend is running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`API base URL: http://localhost:${port}/v1/api/`);
    });
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  }
})();