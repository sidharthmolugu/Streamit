const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: String,
    size: Number,
    status: {
      type: String,
      enum: ["uploaded", "processing", "done", "failed"],
      default: "uploaded",
    },
    sensitivity: {
      type: String,
      enum: ["unknown", "safe", "flagged"],
      default: "unknown",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    tenant: { type: String, default: null },
    durationSec: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Video", videoSchema);
