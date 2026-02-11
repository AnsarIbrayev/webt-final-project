require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDB } = require("./database/mongo");
const User = require("./models/User");

(async () => {
  await connectDB();

  const email = "admin@example.com";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await User.updateOne(
    { email },
    { $set: { email, passwordHash, role: "admin" } },
    { upsert: true }
  );

  console.log("Admin ready:", email, password);
  process.exit(0);
})();
