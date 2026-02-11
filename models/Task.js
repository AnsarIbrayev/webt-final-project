const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, default: null },
  category: { type: String, default: "general", trim: true },
  tags: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
