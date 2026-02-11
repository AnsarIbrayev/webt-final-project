require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const { connectDB } = require("./database/mongo");

const authRoutes = require("./routes/auth");
const tasksRouter = require("./routes/tasks");

const app = express();

// IMPORTANT for Render / proxies (fixes secure cookies / sessions)
app.set("trust proxy", 1);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      // On production (Render) set secure cookies correctly behind proxy
      secure: process.env.NODE_ENV === "production" ? "auto" : false,
      sameSite: "lax",
    },
  })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(authRoutes); // /register, /login, /logout, /me
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
    // UI can still run, but API will fail if DB is down
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
