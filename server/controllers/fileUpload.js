const File = require("../models/File");
const { sendUploadedNotification } = require("../config/mailer");
const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file, user, tags) => {
  try {
    console.log("📁 Starting upload to Cloudinary...");
    console.log("📝 File details:", {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      tempFilePath: file.tempFilePath ? "Exists" : "Missing",
    });

    const options = {
      folder: `uploads/${user._id}`,
      resource_type: "auto",
      tags: tags || ["general"],
    };

    console.log("☁️ Cloudinary options:", options);

    // Check if file exists
    if (!file.tempFilePath) {
      throw new Error(
        "Temporary file path not found. Check express-fileupload configuration."
      );
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);

    console.log("✅ Cloudinary upload successful:", {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
    });

    const fileDoc = await File.create({
      name: file.name,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      tags: Array.isArray(tags) ? tags : [tags || "general"],
      uploadedBy: user._id,
      email: user.email,
    });

    console.log("💾 File saved to database:", fileDoc._id);

    // Send email notification
    try {
      await sendUploadedNotification(
        user.email,
        {
          name: file.name,
          url: result.secure_url,
          format: result.format,
          size: result.bytes,
        },
        user.username
      );
      console.log("📧 Email notification sent");
    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError.message);
    }

    return {
      file: fileDoc,
      cloudinaryResult: result,
    };
  } catch (error) {
    console.error("❌ Error in uploadToCloudinary:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const localFileUpload = async (req, res) => {
  console.log("\n=== LOCAL FILE UPLOAD START ===");
  console.log("📦 Request body:", req.body || "No body");
  console.log(
    "📦 Request files:",
    req.files ? Object.keys(req.files) : "No files"
  );
  console.log("👤 User:", req.user ? req.user._id : "No user");

  try {
    const body = req.body || {};
    const { tags } = body;

    if (!req.files || !req.files.file) {
      console.log("❌ No file in request");
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a file.",
        details: {
          filesPresent: req.files ? Object.keys(req.files) : [],
          contentType: req.headers["content-type"],
        },
      });
    }

    const file = req.files.file;
    console.log("📄 File received:", {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      tempFilePath: file.tempFilePath ? "Exists" : "Missing",
    });

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log("❌ File too large:", file.size, "bytes");
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 50MB.",
        size: file.size,
        maxSize: maxSize,
      });
    }

    const uploadResult = await uploadToCloudinary(file, req.user, tags);

    console.log("✅ Upload successful");

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        file: uploadResult.file,
        cloudinaryUrl: uploadResult.cloudinaryResult.secure_url,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading file:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
      details: error.stack,
    });
  }
};

const imageUpload = async (req, res) => {
  console.log("\n=== IMAGE UPLOAD START ===");
  console.log("📦 Request body:", req.body || "No body");
  console.log(
    "📦 Request files:",
    req.files ? Object.keys(req.files) : "No files"
  );

  try {
    const body = req.body || {};
    const { tags } = body;

    if (!req.files || !req.files.image) {
      console.log("❌ No image in request");
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const image = req.files.image;

    console.log("🖼️ Image received:", {
      name: image.name,
      size: image.size,
      mimetype: image.mimetype,
    });

    if (!image.mimetype.startsWith("image/")) {
      console.log("❌ Not an image file:", image.mimetype);
      return res.status(400).json({
        success: false,
        message: "Please upload an image file (jpg, png, gif, etc.)",
        receivedType: image.mimetype,
      });
    }

    const uploadResult = await uploadToCloudinary(image, req.user, tags);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: uploadResult,
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};

const videoUpload = async (req, res) => {
  console.log("\n=== VIDEO UPLOAD START ===");
  console.log("📦 Request body:", req.body || "No body");
  console.log(
    "📦 Request files:",
    req.files ? Object.keys(req.files) : "No files"
  );

  try {
    const body = req.body || {};
    const { tags } = body;

    if (!req.files || !req.files.video) {
      console.log("❌ No video in request");
      return res.status(400).json({
        success: false,
        message: "No video uploaded",
      });
    }

    const video = req.files.video;

    console.log("🎥 Video received:", {
      name: video.name,
      size: video.size,
      mimetype: video.mimetype,
    });

    if (!video.mimetype.startsWith("video/")) {
      console.log("❌ Not a video file:", video.mimetype);
      return res.status(400).json({
        success: false,
        message: "Please upload a video file (mp4, avi, mov, etc.)",
        receivedType: video.mimetype,
      });
    }

    const uploadResult = await uploadToCloudinary(video, req.user, tags);

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: uploadResult,
    });
  } catch (error) {
    console.error("❌ Error uploading video:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message,
    });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).sort({
      uploadedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
      error: error.message,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({ _id: id, uploadedBy: req.user._id });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await cloudinary.uploader.destroy(file.public_id);

    await File.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
};

module.exports = {
  localFileUpload,
  imageUpload,
  videoUpload,
  getUserFiles,
  deleteFile,
};
