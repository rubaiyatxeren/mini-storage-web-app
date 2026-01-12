const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const connectDB = require("./config/database");
const cloudinaryConnect = require("./config/cloudinary");
require("dotenv").config();

// Create Express app
const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());

// Parse JSON for all routes EXCEPT file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    parseNested: true, // Add this to parse nested form data
    createParentPath: true, // Create parent directories if they don't exist
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Mini Storage Web App",
    version: "1.0.0",
    success: true,
    endpoints: {
      auth: "/api/auth",
      upload: "/api/upload",
    },
  });
});

// Initialize function
const initializeApp = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Connect to Cloudinary
    cloudinaryConnect();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📝 API Documentation:`);
      console.log(`   🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   📁 Upload: http://localhost:${PORT}/api/upload`);
    });
  } catch (error) {
    console.error("❌ Error initializing app:", error.message);
    process.exit(1);
  }
};

// Initialize and start the application
initializeApp();
