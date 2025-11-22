import crypto from "crypto";
import baseX from "base-x";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62 = baseX(BASE62);

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest(); // returns a Buffer
}

export function makePublicId(userUUID) {
  const hashBuffer = sha256(userUUID);
  const encoded = base62.encode(hashBuffer);
  return encoded.slice(0, 10); 
}