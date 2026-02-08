require("dotenv").config();
const { mongoose } = require("./database/mongo");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  dueDate: Date,
  category: String,
  tags: [String],
  createdAt: Date
});

const Task = mongoose.model("Task", taskSchema);

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const statuses = ["pending", "in-progress", "done"];
  const priorities = ["low", "medium", "high"];
  const categories = ["study", "work", "personal", "general"];
  const tagPool = ["uni", "ai", "urgent", "health", "project", "exam", "home"];

  const tasks = Array.from({ length: 25 }).map((_, i) => {
    const due = new Date();
    due.setDate(due.getDate() + (i % 14));

    return {
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      dueDate: i % 3 === 0 ? due : null,
      category: categories[i % categories.length],
      tags: [tagPool[i % tagPool.length], tagPool[(i + 2) % tagPool.length]],
      createdAt: new Date()
    };
  });

  await Task.deleteMany({});
  await Task.insertMany(tasks);

  console.log("Seeded tasks:", tasks.length);
  process.exit(0);
})();
