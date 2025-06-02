"server-only";

import errorAlert from "../../../components/alerts/error";

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    if (url.protocol === "https:") return true;
    else return false;
  } catch (error) {
    errorAlert("", "", error);
    return false;
  }
}
