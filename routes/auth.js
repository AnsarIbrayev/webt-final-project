const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    if (String(password).length < 6) return res.status(400).json({ error: "Password too short" });

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: "user"
    });

    req.session.user = { id: user._id.toString(), email: user.email, role: user.role };
    return res.status(201).json({ message: "Registered", user: req.session.user });
  } catch (e) {
    return res.status(500).json({ error: "Register failed" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    req.session.user = { id: user._id.toString(), email: user.email, role: user.role };
    return res.json({ message: "Logged in", user: req.session.user });
  } catch (e) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST /logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// GET /me
router.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  return res.json(req.session.user);
});

module.exports = router;
