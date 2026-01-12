const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// profile Route (protected)
router.get("/profile", auth, getProfile);

module.exports = router;
