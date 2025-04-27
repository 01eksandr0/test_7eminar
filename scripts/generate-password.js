import bcrypt from "bcrypt";

async function generateHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Password:", password);
  console.log("Hashed password:", hash);
}

// Generate hash for the default password
generateHash("password");
