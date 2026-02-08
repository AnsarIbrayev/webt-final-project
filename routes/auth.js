const express = require("express");
const router = express.Router();

// POST /login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "admin123") {
    req.session.user = { email, role: "admin" };
    return res.json({ message: "Logged in" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

// POST /logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// GET /me
router.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  res.json(req.session.user);
});

module.exports = router;
