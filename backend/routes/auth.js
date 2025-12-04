const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// NOTE: this is a simple demo auth. Do not use in production without improvements.
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ error: "user exists" });
  const hash = await bcrypt.hash(password, 10);
  // allow optional tenant on registration for demo multi-tenant support
  const tenant = req.body.tenant || null;
  const u = new User({ username, passwordHash: hash, tenant });
  await u.save();
  res.json({ message: "registered" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ username });
  if (!u) return res.status(401).json({ error: "invalid" });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid" });
  const token = jwt.sign(
    { id: u._id, role: u.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.json({ token, user: { id: u._id, username: u.username, role: u.role } });
});

module.exports = router;
