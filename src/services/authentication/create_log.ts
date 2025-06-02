import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import crypto, { CipherGCMTypes, createCipheriv } from "crypto";

const createLog = (token: AdapterUser | string | User) => {
  ///========================================================
  // Create the log object for session
  ///========================================================
  const salt = crypto.randomBytes(Number(process.env.saltLength!));
  const iv = crypto.randomBytes(Number(process.env.ivLength!));
  const masterKey = Buffer.from(process.env.secure_key!, "base64");

  // Derive encryption key from master key and salt
  const key = crypto.pbkdf2Sync(
    masterKey,
    salt,
    parseInt(process.env.iterations!),
    parseInt(process.env.keyLength!),
    process.env.digest as string
  );
  //
  // Payload
  const payload = {
    token,
    exp: Date.now() + 2 * 60 * 1000, // 2 minutes from now
  };
  const payloadString = JSON.stringify(payload);

  // Encrypt
  const cipher = createCipheriv(
    process.env.algorithm as CipherGCMTypes,
    key,
    iv
  ) as crypto.CipherCCM;
  const encrypted_data = Buffer.concat([
    cipher.update(payloadString, "utf8"),
    cipher.final(),
  ]);

  // Get authentication tag
  const tag = cipher.getAuthTag();

  // Combine parts: salt:iv:tag:encrypted
  const log = Buffer.concat([salt, iv, tag, encrypted_data]).toString("base64");
  //
  return log;
};

export default createLog;
