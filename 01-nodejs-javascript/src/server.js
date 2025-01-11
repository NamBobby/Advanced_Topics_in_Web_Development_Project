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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const processAndRunSQLFile = async (filePath) => {
  try {
    let sql = fs.readFileSync(filePath, "utf8");

    sql = sql
      .replace(/\\r\\n/g, "\n") 
      .replace(/\\\\/g, "\\")
      .replace(/\\/g, "/") 
      .replace(/--.*?(\r?\n|$)/g, "")
      .replace(/\/\*.*?\*\//gs, "");

    sql = `SET FOREIGN_KEY_CHECKS = 0;\n${sql}\nSET FOREIGN_KEY_CHECKS = 1;`;

    const statements = sql.split(";").filter((stmt) => stmt.trim()); 

    for (const stmt of statements) {
      await sequelize.query(stmt); 
    }
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

(async () => {
  try {
    await connectToDatabase();

    const shouldForceSync = false;
    if (shouldForceSync) {
      await sequelize.sync({ force: true });
      const sqlFilePath = path.join(__dirname, "config", "Database.sql");
      await processAndRunSQLFile(sqlFilePath);
    } else {
      await sequelize.sync();
    }

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.error(">>> Error connecting to DB:", error);
  }
})();
