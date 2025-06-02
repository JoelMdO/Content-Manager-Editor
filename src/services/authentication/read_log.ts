import crypto, { CipherGCMTypes, createDecipheriv } from "crypto";
const readLog = (session: string) => {
  ///========================================================
  // Function to read the lgo
  ///========================================================
  //
  const buffer = Buffer.from(session, "base64");
  const saltLength = Number(process.env.saltLength);
  const ivLength = Number(process.env.ivLength);
  const tagLength = Number(process.env.tagLength);
  //
  if (buffer.length < saltLength + ivLength) {
    throw new Error(
      `Invalid buffer: Not enough data. Expected at least ${
        saltLength + ivLength
      } bytes but got ${buffer.length}`
    );
  }
  const minLength = saltLength + ivLength + tagLength;
  if (buffer.length < minLength) {
    throw new Error(
      `Invalid buffer: Expected at least ${minLength} bytes but got ${buffer.length}`
    );
  }
  //
  // Extract components
  const salt = buffer.subarray(0, saltLength);
  const iv = buffer.subarray(saltLength, saltLength + ivLength);
  const tag = buffer.subarray(
    saltLength + ivLength,
    saltLength + ivLength + tagLength
  );
  const encryptedData = buffer.subarray(saltLength + ivLength + tagLength);
  // Derive the key
  const masterKey = Buffer.from(process.env.secure_key!, "base64"); // Your master key
  const key = crypto.pbkdf2Sync(
    masterKey,
    salt,
    Number(process.env.iterations!),
    Number(process.env.keyLength!),
    process.env.digest!
  );
  //
  if (!iv || iv.length !== ivLength) {
    throw new Error(
      `Invalid IV: Expected ${ivLength} bytes but got ${iv.length}`
    );
  }
  // Decifer the data
  const decipher = createDecipheriv(
    process.env.algorithm as CipherGCMTypes,
    key,
    iv
  ) as crypto.DecipherGCM;
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedData, undefined, "utf8");
  decrypted += decipher.final("utf8"); // Complete the decryption
  decrypted = decrypted
    .trim()
    .replace(/\x00/g, "")
    .replace(/[^\x20-\x7E]/g, "");

  // Check if the expiration is valid
  const parsed = JSON.parse(decrypted);
  const exp = parsed.exp; // from your token
  const now = Date.now();
  const margin = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Check 1: Is the token expired?
  const isExpired = now > exp;

  // Check 2: Is it within the 2-minute valid range?
  const isWithin2Minutes = exp - now <= margin && !isExpired;

  if (isExpired || !isWithin2Minutes) {
    return false;
  } else {
    return true;
  }
};

export default readLog;
