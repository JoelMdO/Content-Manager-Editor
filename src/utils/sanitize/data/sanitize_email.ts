import validator from "validator";

export function sanitizeEmail(email: string | null | undefined): string {
  if (typeof email !== "string") return "";

  const trimmed = email.trim().toLowerCase();
  if (validator.isEmail(trimmed)) {
    const normalized = validator.normalizeEmail(trimmed);
    return normalized ? normalized : "";
  }
  return "";
}
