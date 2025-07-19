import "server-only";
import { adminAuth } from "./admin_config";
import { v4 as uuidv4 } from "uuid";
import createLog from "./create_log";
import { generateSessionType } from "@/types/generateSession";
import crypto from "crypto";

// Cache for token verification results
const tokenCache = new Map<string, { uid: string; expires: number }>();

// Clear expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenCache.entries()) {
    if (value.expires < now) {
      tokenCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

async function generateSession(
  token: string
): Promise<generateSessionType | { status: number; message: string }> {
  ///==================================================
  /// Optimized session generation
  ///==================================================
  
  try {
    // Check token cache first
    const cacheKey = crypto.createHash('sha256').update(token).digest('hex');
    const cached = tokenCache.get(cacheKey);
    
    let user: string;
    
    if (cached && cached.expires > Date.now()) {
      user = cached.uid;
    } else {
      //==================================================
      // Verify the token and obtain the userId
      //==================================================
      const decodedToken = await adminAuth.verifyIdToken(token);
      user = decodedToken.uid;
      
      if (!user) {
        return { status: 400, message: "User not found." };
      }
      
      // Cache the result for 5 minutes
      tokenCache.set(cacheKey, {
        uid: user,
        expires: Date.now() + 5 * 60 * 1000
      });
    }
    
    //==================================================
    // Create a log for the session (now cached)
    //==================================================
    const log = createLog(token);
    
    //==================================================
    // Generate the session
    //==================================================
    const sessionId = uuidv4();
    const body_session: object = {
      log,
      createdAt: Date.now(),
      validUntil: Date.now() + 60 * 60 * 1000, // 1 hour
    };
    
    //==================================================
    // Hash session ID - use faster hashing
    //==================================================
    const hashedSessionId = crypto.createHash('sha256')
      .update(sessionId)
      .digest('hex');
    
    //==================================================
    // Encrypt Payload (reuse createLog for consistency)
    //==================================================
    const sessionPlate = createLog(user);
    
    //==================================================
    // Return session data
    //==================================================
    return {
      session: body_session,
      sessionId: hashedSessionId,
      user: user,
      sessionPlate: sessionPlate,
    };
  } catch (error) {
    return { status: 500, message: `Session generation failed: ${error}` };
  }
}

export default generateSession;
