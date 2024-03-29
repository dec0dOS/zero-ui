import crypto from "crypto";
import hashPassword from "pbkdf2-wrapper/hashText.js";

export async function initAdmin() {
  if (!process.env.ZU_DEFAULT_PASSWORD || !process.env.ZU_DEFAULT_USERNAME) {
    console.error("ZU_DEFAULT_PASSWORD or ZU_DEFAULT_USERNAME not found!");
    process.exit(1);
  }
  const username = process.env.ZU_DEFAULT_USERNAME;
  const hash = await hashPassword(process.env.ZU_DEFAULT_PASSWORD);
  return {
    username: username,
    password_hash: hash,
    token: crypto.randomBytes(16).toString("hex"),
  };
}
