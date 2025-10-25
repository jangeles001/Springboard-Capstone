import crypto from "crypto";
// Look into bcrypt;

const SCRYPT_KEYLEN = 64; // Size of hash

// Creates random string (salt) of length bytes for each hash
export function generateSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

// Hashes password and salt together using scrypt algorithm
export function hashPassword(password, salt) {
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN); // Returns hex string
  return derivedKey.toString("hex");
}

// Recomputes hash using the user's password and stored salt
export function verifyPassword(providedPassword, storedHash, storedSalt) {
  const derived = crypto.scryptSync(
    providedPassword,
    storedSalt,
    SCRYPT_KEYLEN
  );
  const stored = Buffer.from(storedHash, "hex");

  // Verification fails if the stored buffer is not the same length as the derived buffer
  if (stored.length !== derived.length) return false;

  // Uses timingSafeEqual for constant-time comparisons to prevent timing attacks
  return crypto.timingSafeEqual(stored, derived);
}
