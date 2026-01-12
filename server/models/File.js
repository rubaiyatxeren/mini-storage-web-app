const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "File name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  url: {
    type: String,
    required: [true, "File URL is required"],
  },
  public_id: {
    type: String,
  },
  format: {
    type: String,
  },
  size: {
    type: Number,
  },
  tags: {
    type: [String],
    default: [],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
