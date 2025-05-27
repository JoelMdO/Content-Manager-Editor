"server-only";
export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    if (url.protocol === "https:") return true;
    else return false;
  } catch (error) {
    return false;
  }
}
