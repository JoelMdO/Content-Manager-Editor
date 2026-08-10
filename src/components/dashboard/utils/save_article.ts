import callHub from "@/services/api/call_hub";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanNestedDivs } from "./clean_content";
import { blobToBase64, getBlob } from "@/lib/imageStore/imageStore";

// TipTap emits "<p></p>" for an empty editor — treat that the same as "".
const TIPTAP_EMPTY = "<p></p>";
const DEBUG_AUTOSAVE_EMPTY = false;

const saveArticle = async ({
  dbName,
  currentTitle,
  currentBody,
  language,
  type,
}: Partial<ButtonProps>) => {
  //
  // Purpose: Skip saving when the editor is empty (no real content).
  //---------------------------------------------------------------------------------------------
  if (currentTitle !== undefined && currentBody !== undefined) {
    if (
      !currentTitle ||
      currentTitle === TIPTAP_EMPTY ||
      !currentBody ||
      currentBody === TIPTAP_EMPTY
    ) {
      if (DEBUG_AUTOSAVE_EMPTY) {
        console.log({ currentTitle, currentBody });
        console.log("empty currentBody and Title at saveArticle");
      }

      return;
    }
    const localStoreText = localStorage.getItem(
      `draft-articleContent-${dbName}`,
    );
    const localStoreArticle = JSON.parse(localStoreText || "[]");

    type ArticleItem = {
      type: string;
      content?: string;
      imageId?: string;
      fileName?: string;
      blobUrl?: string;
      base64?: string;
      // add other fields as needed
    };

    const localMap = new Map<string, ArticleItem>(
      (localStoreArticle as ArticleItem[]).map((item) => [item.type, item]),
    );

    const titleKey = language === "es" ? "es-title" : "title";
    const bodyKey = language === "es" ? "es-body" : "body";
    localMap.set(titleKey, { type: titleKey, content: currentTitle });
    localMap.set(bodyKey, {
      type: bodyKey,
      content: cleanNestedDivs(currentBody),
    });

    if (language !== "es") {
      const existingId = localMap.get("id");
      if (!existingId?.content) {
        localMap.set("id", { type: "id", content: "" });
      }
    }

    localStorage.setItem(
      `draft-articleContent-${dbName}`,
      JSON.stringify(Array.from(localMap.values())),
    );

    if (type === "store") {
      // Retrieve the image blob from IndexedDB and convert it to base64
      const imageItems = Array.from(localMap.values()).filter((item) =>
        item.type.startsWith("image"),
      );

      console.log("saveArticle imageItems", imageItems);
      console.log(
        "imageid",
        imageItems.map((item) => item.imageId),
      );

      const images = await Promise.all(
        imageItems.map(async (item) => {
          const blob = item.imageId ? await getBlob(item.imageId) : undefined;
          console.log("saveArticle image blob", blob);
          console.log("saveArticle image item", item);

          return {
            type: item.type,
            imageId: item.imageId ?? "",
            fileName: item.fileName ?? "",
            base64: blob ? await blobToBase64(blob) : (item.base64 ?? ""),
          };
        }),
      );
      //
      console.log("saveArticle images", images);
      const saveData = {
        title: localMap.get(titleKey)?.content || "",
        body: localMap.get(bodyKey)?.content || "",
        images: images,
      };
      const response = await callHub("save", saveData);
      return response;
    }
    return { status: 200, message: "Article saved locally" };
  }
};
export default saveArticle;
