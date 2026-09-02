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
import { sanitizeSummary } from "./sanitize_summary";

export async function sanitizeData(
  data: dataType,
  type: string,
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
  switch (type) {
    case "clean-link":
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
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Images / Files
    ///--------------------------------------------------------
    case "clean-image":
      if (data instanceof File) {
        sanitizedData = await sanitizeFile(data);
      }
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean post
    ///--------------------------------------------------------
    case "post":
      if (
        data !== null &&
        !(data instanceof File) &&
        !(data instanceof FormData)
      ) {
        const sanitized = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            sanitizePost(value as string | undefined),
          ]),
        );
        sanitizedData = {
          status: 200,
          message: sanitized,
        };
      } else {
        sanitizedData = { status: 400, message: "Invalid post data" };
      }
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Playbook Data
    ///--------------------------------------------------------
    case "playbook-save":
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
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Sign-in Data
    ///--------------------------------------------------------
    case "sign-in-by-email":
      if (
        typeof data === "object" &&
        data !== null &&
        "email" in data &&
        "password" in data
      ) {
        const newEmail = sanitizeEmail((data as { email: string }).email);
        const newPassword = sanitizePassword(
          (data as { password: string }).password,
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
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Password Reset Data
    ///--------------------------------------------------------
    case "password-reset":
      if (typeof data === "object" && data !== null && "email" in data) {
        const newEmail = sanitizeEmail((data as { email: string }).email);
        if (newEmail === "") {
          sanitizedData = { status: 400, message: "Invalid email" };
        } else {
          sanitizedData = { status: 200, message: { email: newEmail } };
        }
      } else {
        sanitizedData = { status: 400, message: "Invalid password-reset data" };
      }
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Save User Data
    ///--------------------------------------------------------
    case "save-user":
      if (typeof data === "object" && data !== null && "email" in data) {
        const newEmail = sanitizeEmail((data as { email: string }).email);
        if (newEmail === "") {
          sanitizedData = { status: 400, message: "Invalid email" };
        } else {
          const message: { email: string; provider?: string } = {
            email: newEmail,
          };
          if ("provider" in data) {
            message.provider = sanitizeHtml(
              (data as { provider: string }).provider,
            );
          }
          sanitizedData = { status: 200, message };
        }
      } else {
        sanitizedData = { status: 400, message: "Invalid save-user data" };
      }
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Summary Data
    ///--------------------------------------------------------
    case "summary":
      const sanitizedText = sanitizeSummary(data);
      sanitizedData = { status: 200, message: sanitizedText };
      break;
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // Clean Save Article
    ///--------------------------------------------------------
    case "save":
      console.log("doing save at sanitizeData, type: " + type);
      if (
        typeof data === "object" &&
        data !== null &&
        !(data instanceof File) &&
        !(data instanceof FormData) &&
        "title" in data &&
        "body" in data
      ) {
        console.log("type of data: " + typeof data);
        console.log("data at sanitizeData, type: " + type, data);
        sanitizedData = {
          status: 200,
          message: {
            title: sanitizePost((data as { title: string }).title),
            body: sanitizePost((data as { body: string }).body),
          },
        };
      } else {
        sanitizedData = { status: 400, message: "Invalid save data" };
      }
      break;
    default:
      ///--------------------------------------------------------
      // Clean Text
      ///--------------------------------------------------------
      // //console.log('"type at sanitizeData:", type);' + type);
      // //console.log("type of data at sanitizeData:", typeof data);

      if (typeof data === "string") {
        ////console.log('"type of data is string at sanitizeData"');

        const sanitizedText = sanitizeUrl(data, type);
        // //console.log(
        //   '"sanitizedText at sanitizeData:", sanitizedText);' + sanitizedText
        // );

        if (sanitizedText.status === 200) {
          sanitizedData = { status: 200, message: "Valid text input" };
        } else {
          sanitizedData = { status: 400, message: "Invalid text input" };
        }
        return sanitizedData;
      } else {
        //is not a string return error.
        ////console.log("doing else at sanitizeData, type: " + type);

        sanitizedData = { status: 205, message: "text not allowed" };
      }
  }
  console.log("sanitizedData at sanitizeData:", sanitizedData);
  return sanitizedData;
}
