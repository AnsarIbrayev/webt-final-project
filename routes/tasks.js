const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const Task = require("../models/Task");

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
}

// READ (тоже лучше защитить, потому что это user data)
router.get("/", requireAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = (req.user.role === "admin")
      ? {}
      : { ownerId: req.user.id };

    const [items, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter)
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({ items, page, totalPages, total });
  } catch (e) {
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Not found" });

    // owner check (admin can read all)
    if (req.user.role !== "admin" && task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(task);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// CREATE (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category, tags } = req.body;
    if (!title || !String(title).trim()) return res.status(400).json({ error: "Title is required" });

    const saved = await Task.create({
      ownerId: req.user.id,
      title: String(title).trim(),
      description: String(description || "").trim(),
      status: status || "pending",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      category: String(category || "general").trim() || "general",
      tags: parseTags(tags)
    });

    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: "Create failed" });
  }
});

// UPDATE (protected + owner-only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const patch = { ...req.body };
    if (patch.tags !== undefined) patch.tags = parseTags(patch.tags);
    if (patch.dueDate !== undefined) patch.dueDate = patch.dueDate ? new Date(patch.dueDate) : null;

    const updated = await Task.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE (protected + owner-only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// (опционально) Admin endpoint: удалить ВСЕ задачи
router.delete("/", requireAuth, requireAdmin, async (req, res) => {
  await Task.deleteMany({});
  res.json({ message: "All tasks deleted (admin)" });
});

module.exports = router;
