require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@example.com";
  const password = "admin123";

  const passwordHash = await bcrypt.hash(password, 10);

  await User.updateOne(
    { email },
    { email, passwordHash },
    { upsert: true }
  );

  console.log("User created:");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit();
})();
