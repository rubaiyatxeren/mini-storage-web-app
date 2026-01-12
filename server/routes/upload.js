const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  localFileUpload,
  imageUpload,
  videoUpload,
  getUserFiles,
  deleteFile,
} = require("../controllers/fileUpload");

// Apply auth middleware to all routes
router.use(auth);

// Upload routes
router.post("/file", localFileUpload);
router.post("/image", imageUpload);
router.post("/video", videoUpload);

// File management routes
router.get("/files", getUserFiles);
router.delete("/file/:id", deleteFile);

module.exports = router;
