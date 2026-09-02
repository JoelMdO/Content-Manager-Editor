import callHub from "@/services/api/call_hub";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanNestedDivs } from "./clean_content";
import { blobToBase64, getBlob } from "@/lib/imageStore/imageStore";
import { useUIStore } from "@/store/useUIStore";
import { StorageArticle } from "@/types/storage_item";

// TipTap emits "<p></p>" for an empty editor — treat that the same as "".
const TIPTAP_EMPTY = "<p></p>";
const DEBUG_AUTOSAVE_EMPTY = false;

const saveArticle = async ({
  dbName,
  currentTitle,
  currentBody,
  language,
  type,
  // setArticleStored,
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

    console.log(
      "currentTitle and currentBody are not empty, proceeding to saveArticle",
    );
    console.log("saveArticle currentTitle:", currentTitle);
    console.log("saveArticle currentBody:", currentBody);

    const localStoreText = localStorage.getItem(
      `draft-articleContent-${dbName}`,
    );
    const localStoreArticle = JSON.parse(localStoreText || "[]");
    console.log("Type of:", typeof localStoreArticle);

    const titleKey = language === "es" ? "es_title" : "title";
    const bodyKey = language === "es" ? "es_body" : "body";

    const indexTitle = localStoreArticle.findIndex(
      (item: StorageArticle) => item.type === titleKey,
    );
    console.log("saveArticle indexTitle:", indexTitle);
    const indexBody = localStoreArticle.findIndex(
      (item: StorageArticle) => item.type === bodyKey,
    );
    console.log("saveArticle indexBody:", indexBody);
    if (indexTitle !== -1) {
      localStoreArticle[indexTitle].content = currentTitle;
    } else {
      localStoreArticle.push({ type: titleKey, content: currentTitle });
    }

    if (indexBody !== -1) {
      localStoreArticle[indexBody].content = cleanNestedDivs(currentBody);
    } else {
      localStoreArticle.push({
        type: bodyKey,
        content: cleanNestedDivs(currentBody),
      });
    }
    //
    localStorage.setItem(
      `draft-articleContent-${dbName}`,
      JSON.stringify(localStoreArticle),
    );

    if (type === "store") {
      // Check if the article has section in place already.
      console.log("Doing Store");
      const { setOpenDialogNoSection } = useUIStore.getState();

      const sectionItem = localStoreArticle.find(
        (item: StorageArticle) =>
          item.type === "section" || item.type === "es_section",
      );
      console.log("saveArticle sectionItem", sectionItem);
      if (
        !sectionItem ||
        sectionItem === undefined ||
        sectionItem.content === ""
      ) {
        setOpenDialogNoSection(true);
        console.log({ status: 400, message: "No section selected" });
      }

      if (sectionItem && sectionItem.content !== "") {
        // Retrieve the image blob from IndexedDB and convert it to base64
        const imageItems = localStoreArticle.filter(
          (item: StorageArticle) => item.type === "image",
        );

        console.log("saveArticle imageItems", imageItems);
        console.log("imageid", imageItems);

        let images;
        if (!imageItems.length) {
          console.warn(`No image items found`);
          images = [
            {
              type: "image",
              imageId: "",
              fileName: "Body has the images already",
              base64: "",
            },
          ];
        } else {
          images = await Promise.all(
            imageItems.map(async (item: StorageArticle) => {
              const blob = item.imageId
                ? await getBlob(item.imageId)
                : undefined;
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
        }
        //
        console.log("saveArticle images", images);
        const saveData = {
          title:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === titleKey,
            )?.content || "",
          es_title:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "es_title",
            )?.content || "",
          body:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === bodyKey,
            )?.content || "",
          es_body:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "es_body",
            )?.content || "",
          section:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "section",
            )?.content || "",
          es_section:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "es_section",
            )?.content || "",
          summary:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "summary",
            )?.content || "",
          es_summary:
            localStoreArticle.find(
              (item: StorageArticle) => item.type === "es_summary",
            )?.content || "",
          images: images,
        };
        console.log("saveArticle saveData", saveData);
        const response = await callHub("save", saveData);
        if (response.status == 200) {
          console.log("Updating draft store to indicate article is stored");
          // setArticleStored!(true);
        }
        return response;
      }
    }
    return { status: 200, message: "Article saved locally" };
  }
};
export default saveArticle;
