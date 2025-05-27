export function sanitizePassword(password: string | null | undefined): string {
  if (typeof password !== "string") return "";

  // Don't escape passwords as they need to be hashed as-is
  // Just remove dangerous control characters and limit length
  return password
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
    .substring(0, 128); // Reasonable password length limit
}
