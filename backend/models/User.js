const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "editor", "admin"],
      default: "editor",
    },
    tenant: { type: String, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
