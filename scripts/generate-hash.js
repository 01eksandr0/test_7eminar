import bcrypt from "bcrypt";
import { writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersPath = join(__dirname, "../server/data/users.json");

const password = "password";
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  const userData = [
    {
      id: "user123",
      email: "test@example.com",
      password: hash,
    },
  ];

  writeFileSync(usersPath, JSON.stringify(userData, null, 2));
  console.log("Updated users.json with hashed password");
  console.log("Test credentials:");
  console.log("Email: test@example.com");
  console.log("Password: password");
});
