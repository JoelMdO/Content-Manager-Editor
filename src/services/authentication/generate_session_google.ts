import "server-only";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import createLog from "./create_log";
import { JWT } from "next-auth/jwt";
import { Adapter, AdapterUser } from "next-auth/adapters";

async function generateSessionGoogle(
  token: JWT,
  user: AdapterUser
): Promise<{
  session: Object;
  sessionId: string;
  user: string;
  sessionPlate: string;
}> {
  //==================================================
  // Create a log for the session
  //==================================================
  const log = createLog(token);
  //==================================================
  // Generate the session
  //==================================================
  const sessionId = uuidv4();
  const body_session: Object = {
    log,
    createdAt: Date.now(),
    validUntil: Date.now() + 60 * 60 * 1000, // 1 hour
  };
  //==================================================
  // Hash session ID
  //==================================================
  const crypto = require("crypto");
  const hash = crypto.createHash(process.env.NEXT_PUBLIC_HASH_ALGORITHM!);
  hash.update(sessionId);
  const hashedSessionId = hash.digest(process.env.NEXT_PUBLIC_HASH_DIGEST!);
  //==================================================
  // Encrypt Payload
  //==================================================
  const sessionPlate = createLog(user);
  //==================================================
  // Store the session
  //==================================================
  return {
    session: body_session,
    sessionId: hashedSessionId,
    user: user.toString(),
    sessionPlate: sessionPlate,
  };
}

export default generateSessionGoogle;
