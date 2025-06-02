import "server-only";
function generateNonce() {
  const bytes = parseInt(process.env.keyLength || "16", 10); // Default to 16 if not set
  const array = new Uint8Array(bytes); // Generate random bytes
  crypto.getRandomValues(array); // Fill array with random values
  return btoa(String.fromCharCode(...array)); // Convert to base64
}

export default generateNonce;
