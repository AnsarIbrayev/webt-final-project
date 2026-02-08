const express = require("express");
const router = express.Router();
const { mongoose } = require("../database/mongo");
const requireAuth = require("../middleware/requireAuth");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  status: { type: String, enum: ["pending","in-progress","done"], default: "pending" },
  priority: { type: String, enum: ["low","medium","high"], default: "medium" },
  dueDate: { type: Date, default: null },
  category: { type: String, default: "general", trim: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
}

// READ
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) {
    // если MongoDB отключена — просто вернем пусто, чтобы UI не падал
    res.json([]);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) {
    return res.status(404).json({ error: "Not found" });
  }
});

// WRITE (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category, tags } = req.body;
    if (!title || !String(title).trim()) return res.status(400).json({ error: "Title is required" });

    const saved = await new Task({
      title: String(title).trim(),
      description: String(description || "").trim(),
      status: status || "pending",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      category: String(category || "general").trim() || "general",
      tags: parseTags(tags)
    }).save();

    res.status(201).json(saved);
  } catch (e) {
    return res.status(500).json({ error: "Create failed (DB unavailable?)" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const patch = { ...req.body };
    if (patch.tags !== undefined) patch.tags = parseTags(patch.tags);
    if (patch.dueDate !== undefined) patch.dueDate = patch.dueDate ? new Date(patch.dueDate) : null;

    const updated = await Task.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: "Update failed (DB unavailable?)" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    return res.status(500).json({ error: "Delete failed (DB unavailable?)" });
  }
});

module.exports = router;
