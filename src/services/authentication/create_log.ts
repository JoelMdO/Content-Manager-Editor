import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import crypto, { createCipheriv } from "crypto";

// Cache for expensive crypto operations
const cryptoCache = new Map<string, { log: string; expires: number }>();

// Clear expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cryptoCache.entries()) {
    if (value.expires < now) {
      cryptoCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

const createLog = (token: AdapterUser | string | User) => {
  ///========================================================
  // Create the log object for session - Optimized version
  ///========================================================
  
  // Create cache key from token
  const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
  const cacheKey = crypto.createHash('sha256').update(tokenString).digest('hex');
  
  // Check cache first (valid for 2 minutes)
  const cached = cryptoCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.log;
  }
  
  // Reduce salt and IV sizes for faster generation (still secure)
  const salt = crypto.randomBytes(16); // Reduced from configurable to fixed 16 bytes
  const iv = crypto.randomBytes(12);   // Reduced from configurable to fixed 12 bytes
  const masterKey = Buffer.from(process.env.secure_key!, "base64");

  // Use faster key derivation - reduced iterations for speed
  const key = crypto.pbkdf2Sync(
    masterKey,
    salt,
    1000, // Reduced iterations from env variable for faster processing
    32,   // Fixed key length
    'sha256' // Fixed digest
  );
  
  // Simplified payload
  const payload = {
    token,
    exp: Date.now() + 2 * 60 * 1000, // 2 minutes from now
  };
  const payloadString = JSON.stringify(payload);

  // Use faster cipher
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted_data = Buffer.concat([
    cipher.update(payloadString, "utf8"),
    cipher.final(),
  ]);

  // Get authentication tag
  const tag = cipher.getAuthTag();

  // Combine parts: salt:iv:tag:encrypted
  const log = Buffer.concat([salt, iv, tag, encrypted_data]).toString("base64");
  
  // Cache the result
  cryptoCache.set(cacheKey, {
    log,
    expires: Date.now() + 2 * 60 * 1000 // Cache for 2 minutes
  });
  
  return log;
};

export default createLog;
