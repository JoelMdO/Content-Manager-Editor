"server-only";
import { forEach } from "lodash";
import sanitizeHtml from "sanitize-html";
import { sanitizeUrl } from "./sanitize_url";
import { isValidUrl } from "./valid_url";
import { sanitizeFile } from "../file/sanitize_file";
import { sanitizeFormPlaybook } from "../sanitize_form_playbook";
import { sanitizeEmail } from "./sanitize_email";
import { sanitizePassword } from "./sanitize_pwd";
import { sanitizePost } from "./sanitize_post";

export async function sanitizeData(
  data: any,
  type: string
): Promise<{ status: number; message: string | Record<string, {}> }> {
  //
  ///========================================================
  // Function to sanitize Data as strings, links, urls, images, and files.
  ///========================================================

  let sanitizedData: { status: number; message: string | Record<string, any> } =
    {
      status: 0,
      message: "",
    };
  let value: string = "";
  console.log("At Sanitize data type:", type);
  console.log('"Data at SanitizeData:', data);

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
    sanitizedData = await sanitizeFile(data);
    ///--------------------------------------------------------
    // } else if (data instanceof FormData) {
  } else if (type === "post") {
    ///--------------------------------------------------------
    // Clean data article
    ///--------------------------------------------------------
    console.log('"doing type data instanceof FormData: sanitzing');

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
    // const titleBeforeSanitize = data.title
    // const idBeforeSanitize = data.get("id");
    // const articleBeforeSanitize = data.get("article");
    // const italicBeforeSanitize = data.get("italic");
    // const boldBeforeSanitize = data.get("bold");
    // const imageBeforeSanitize = data.get(`image`);
    // const title = JSON.stringify(titleBeforeSanitize);
    // const id = JSON.stringify(idBeforeSanitize);
    // const article = JSON.stringify(articleBeforeSanitize);
    // const italic = JSON.stringify(italicBeforeSanitize);
    // const bold = JSON.stringify(boldBeforeSanitize);
    // const image = JSON.stringify(imageBeforeSanitize);

    // const dataGroup = [title, id, image, article, italic, bold];
    // try {
    //   forEach(dataGroup, (value) => {
    //     if (typeof value === "string") {
    //       sanitizedData = sanitizeUrl(value);
    //     }
    //   });
    // } catch (error) {
    //   sanitizedData.message = `data not allowed, ${error}`;
    // }
    //--------------------------------------------------------
  } else if (type === "playbook-save") {
    ///--------------------------------------------------------
    // Clean Playbook Data
    ///--------------------------------------------------------
    console.log("doing type playbook-save: sanitzing");
    console.log("data rtype", typeof data);

    const newSanitizedData = sanitizeFormPlaybook(data) as {
      status: number;
      message: string;
    };
    sanitizedData = {
      status: newSanitizedData.status,
      message: newSanitizedData.message,
    };
  } else if (type === "sign-in-by-email") {
    console.log('"doing type sign-in-by-email');

    const newEmail = sanitizeEmail(data.email);
    const newPassword = sanitizePassword(data.password);
    if (newEmail == "" || newPassword == "") {
      sanitizedData = { status: 400, message: "Invalid text input" };
    }
    sanitizedData = {
      status: 200,
      message: { email: newEmail, password: newPassword },
    };
  } else {
    ///--------------------------------------------------------
    // Clean Text
    ///--------------------------------------------------------
    console.log("doing type text at SanitizeData");

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
