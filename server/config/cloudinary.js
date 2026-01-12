const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudinaryConnect = () => {
  try {
    if (
      !process.env.CLOUD_NAME ||
      !process.env.API_KEY ||
      !process.env.API_SECRET
    ) {
      console.error(
        "❌ Cloudinary credentials are not defined in environment variables"
      );
      console.log(
        "CLOUD_NAME:",
        process.env.CLOUD_NAME ? "✅ Set" : "❌ Missing"
      );
      console.log("API_KEY:", process.env.API_KEY ? "✅ Set" : "❌ Missing");
      console.log(
        "API_SECRET:",
        process.env.API_SECRET ? "✅ Set" : "❌ Missing"
      );
      throw new Error(
        "❌ Cloudinary credentials are not defined in environment variables"
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("✅ Cloudinary connected successfully");

    cloudinary.api
      .ping()
      .then(() => {
        console.log("✅ Cloudinary ping successful");
      })
      .catch((e) => {
        console.error("❌ Error pinging Cloudinary:", e.message);
        process.exit(1);
      });
  } catch (error) {
    console.error("❌ Error connecting to Cloudinary:", error.message);
    process.exit(1);
  }
};

module.exports = cloudinaryConnect;
