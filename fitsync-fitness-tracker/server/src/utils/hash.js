import bcrypt from "bcrypt";

// Creates uniqueness of hash based on the saltRounds value provided.
export async function generateSalt(saltRounds = 10) {
  return await bcrypt.genSalt(saltRounds);
}

// Hashes password and salt together using bcrypt hash algorithm
export async function hashPassword(password, salt) {
  return await bcrypt.hash(password, salt);
}

// Recomputes hash using the user's password and stored salt
export async function verifyPassword(providedPassword, storedHash) {
  return await bcrypt.compare(providedPassword, storedHash);
}
