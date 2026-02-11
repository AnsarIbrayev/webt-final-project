require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

// ✅ correct import for connect-mongo (CJS + default export)
const MongoStore = require("connect-mongo").default;

const { connectDB } = require("./database/mongo");

const authRoutes = require("./routes/auth");
const tasksRouter = require("./routes/tasks");

const app = express();

// Render proxy fix
app.set("trust proxy", 1);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Static
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(authRoutes);
app.use("/api/tasks", tasksRouter);

// Pages
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "home.html"))
);
app.get("/about", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "about.html"))
);
app.get("/contact", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "contact.html"))
);

// 404
app.use((req, res) => res.status(404).send("404"));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
