import "server-only";
import { v4 as uuidv4 } from "uuid";
import createLog from "./create_log";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { User } from "next-auth";

async function generateSessionGoogle(
  token: JWT,
  user: AdapterUser | User
): Promise<{
  // session: Object;
  sessionId: string;
  // user: string;
  sessionPlate: string;
}> {
  console.log("atSession generate funciton");
  try {
    //==================================================
    // Create a log for the session
    //==================================================
    const log = createLog(String(token));
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
    const hash = crypto.createHash(process.env.HASH_ALGORITHM!);
    hash.update(sessionId);
    const hashedSessionId = hash.digest(process.env.HASH_DIGEST!);
    //==================================================
    // Encrypt Payload
    //==================================================
    const sessionPlate = createLog(user);
    //==================================================
    // Store the session
    //==================================================
    return {
      // session: body_session,
      sessionId: hashedSessionId,
      // user: user.toString(),
      sessionPlate: sessionPlate,
    };
  } catch (e) {
    console.log("error at google", e);
    return {
      session: {},
      sessionId: "",
      user: "",
      sessionPlate: "",
      error: e instanceof Error ? e.message : "Unknown error",
    } as any;
  }
}

export default generateSessionGoogle;
