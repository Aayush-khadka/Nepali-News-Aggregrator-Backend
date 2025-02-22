import crypto from "crypto";

function generateVerificationToken() {
  return crypto.randomBytes(20).toString("hex"); // 40 characters long token
}

export default generateVerificationToken;
