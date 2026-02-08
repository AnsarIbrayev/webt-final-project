require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const { connectDB } = require("./database/mongo");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: "lax" }
}));

app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
app.use(authRoutes);

const tasksRouter = require("./routes/tasks");
app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "home.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "views", "about.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "views", "contact.html")));

app.use((req, res) => res.status(404).send("404"));

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(); // если MongoDB мертва — не должно ломать UI
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
