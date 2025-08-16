"server-only";
import sanitizeHtml from "sanitize-html";
import { sanitizeUrl } from "./sanitize_url";
import { isValidUrl } from "./valid_url";
import { sanitizeFile } from "../file/sanitize_file";
import { sanitizeFormPlaybook } from "../sanitize_form_playbook";
import { sanitizeEmail } from "./sanitize_email";
import { sanitizePassword } from "./sanitize_pwd";
import { sanitizePost } from "./sanitize_post";
import { dataType } from "../../../types/dataType";
import { PlaybookMetaWithUseRecord } from "../../../components/playbook/types/plabookMeta_with_useRecord";

export async function sanitizeData(
  data: dataType,
  type: string
): Promise<{ status: number; message: string | object | dataType }> {
  //
  ///========================================================
  // Function to sanitize Data as strings, links, urls, images, and files.
  ///========================================================

  let sanitizedData: dataType = { status: 500, message: "unsanitized" };
  let value: string = "";

  ///--------------------------------------------------------
  // Clean Links / URLS
  ///--------------------------------------------------------
  if (type === "clean-link") {
    if (typeof data === "string") {
      value = sanitizeHtml(data);
      // Check if the string is a URL
      if (isValidUrl(value)) {
        sanitizedData = sanitizeUrl(value);
      } else {
        sanitizedData = { status: 205, message: "url not allowed" };
      }
    } else {
      //is not a string return error.
      sanitizedData = { status: 205, message: "url not allowed" };
    }
    ///--------------------------------------------------------
  } else if (type === "clean-image") {
    ///--------------------------------------------------------
    // Clean Images / Files
    ///--------------------------------------------------------
    if (data instanceof File) {
      sanitizedData = await sanitizeFile(data);
    }
    ///--------------------------------------------------------
    // } else if (data instanceof FormData) {
  } else if (type === "post") {
    ///--------------------------------------------------------
    // Clean data article
    ///--------------------------------------------------------

    if (
      data !== null &&
      !(data instanceof File) &&
      !(data instanceof FormData)
    ) {
      const sanitized = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          sanitizePost(value as string | undefined),
        ])
      );
      sanitizedData = {
        status: 200,
        message: sanitized,
      };
    } else {
      sanitizedData = { status: 400, message: "Invalid post data" };
    }
    //--------------------------------------------------------
  } else if (type === "playbook-save") {
    ///--------------------------------------------------------
    // Clean Playbook Data
    ///--------------------------------------------------------

    if (
      typeof data === "object" &&
      data !== null &&
      !(data instanceof File) &&
      !(data instanceof FormData)
    ) {
      sanitizedData = sanitizeFormPlaybook(data as PlaybookMetaWithUseRecord);
    } else {
      sanitizedData = { status: 400, message: "Invalid playbook data" };
    }
  } else if (type === "sign-in-by-email") {
    if (
      typeof data === "object" &&
      data !== null &&
      "email" in data &&
      "password" in data
    ) {
      const newEmail = sanitizeEmail((data as { email: string }).email);
      const newPassword = sanitizePassword(
        (data as { password: string }).password
      );
      if (newEmail == "" || newPassword == "") {
        sanitizedData = { status: 400, message: "Invalid text input" };
      } else {
        sanitizedData = {
          status: 200,
          message: { email: newEmail, password: newPassword },
        };
      }
    } else {
      sanitizedData = { status: 400, message: "Invalid sign-in data" };
    }
  } else {
    ///--------------------------------------------------------
    // Clean Text
    ///--------------------------------------------------------

    if (typeof data === "string") {
      const sanitizedText = sanitizeUrl(data);
      if (sanitizedText.status === 200) {
        sanitizedData = { status: 200, message: "Valid text input" };
      } else {
        sanitizedData = { status: 400, message: "Invalid text input" };
      }
      return sanitizedData;
    } else {
      //is not a string return error.
      sanitizedData = { status: 205, message: "text not allowed" };
    }
  }
  return sanitizedData;
}
