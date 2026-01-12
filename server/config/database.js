const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const DB_URL = process.env.DB_URL;

  if (!DB_URL) {
    console.log("DB_URL is not defined");
    console.error("❌ DB_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
