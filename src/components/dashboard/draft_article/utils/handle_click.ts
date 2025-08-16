import { ButtonProps } from "../../menu/button_menu/type/type_menu_button";
//=========================================================
// HANDLE CLICK, purpose:
// Update UI with the draft article content
//=========================================================
// Define a single props object type that combines all required properties
type HandleClickProps = {
  newSavedTitleRef?: React.RefObject<string>;
  DRAFT_KEY: string;
  savedTitleRef: React.RefObject<string | null>;
  savedBodyRef: React.RefObject<string | null>;
  setDraftArticleButtonClicked?: (clicked: boolean) => void;
  tag: string;
  newTitleRef?: string;
};

// Updated function to accept a single props object
export const handleClick = async ({
  newSavedTitleRef,
  DRAFT_KEY,
  savedTitleRef,
  savedBodyRef,
  setDraftArticleButtonClicked,
  tag,
  newTitleRef,
}: HandleClickProps) => {
  //
  let dbFieldName: string = "body";
  const articleStored = localStorage.getItem(DRAFT_KEY);
  const jsonArticle = JSON.parse(articleStored!);
  //
  if (tag === "translated") {
    savedTitleRef.current = newTitleRef!;
    dbFieldName = "es-body";
  } else if (tag === "draft-en") {
    savedTitleRef.current = newSavedTitleRef!.current;
    dbFieldName = "body";
  } else if (tag === "draft-es") {
    savedTitleRef.current =
      jsonArticle.find((item: any) => item.type === "es-title")?.content || "";
    dbFieldName = "es-body";
  }
  //
  //
  if (jsonArticle) {
    //
    let preSavedBodyRef =
      jsonArticle.find((item: any) => item.type === dbFieldName)?.content || "";

    //-------------------------------------------------------------------------------------
    // Purpose: Load images from IndexedDB and replace <img src="{image_url_placeholder}">
    // with the blob URL for preview in the content editor.
    //-------------------------------------------------------------------------------------
    try {
      let images: any[] = [];
      //try {
      //   const db: IDBDatabase = await new Promise((resolve, reject) => {
      //     const request = window.indexedDB.open("imageStore", 2); // bump to force upgrade
      //     request.onupgradeneeded = (event) => {
      //       const db = (event.target as IDBOpenDBRequest).result;
      //       if (!db.objectStoreNames.contains("images")) {
      //         db.createObjectStore("images", { keyPath: "id" });
      //       } else {
      //       }
      //     };
      //     request.onsuccess = (event) =>
      //       resolve((event.target as IDBOpenDBRequest).result);

      //     request.onerror = () => {
      //       reject("Failed to open IndexedDB");
      //       db.close();
      //     };
      //   });

      //   const transaction = db.transaction("images", "readonly");
      //   const store = transaction.objectStore("images");
      //   images = await new Promise<any[]>((resolve, reject) => {
      //     const allImages: any[] = [];
      //     const request = store.getAll();
      //     request.onsuccess = () => {
      //     };
      //     const cursorRequest = store.openCursor();
      //     cursorRequest.onsuccess = (event) => {
      //       const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
      //         .result;

      //       if (cursor) {
      //         allImages.push(cursor.value);
      //         cursor.continue();
      //       } else {
      //         resolve(allImages);
      //       }
      //       db.close();
      //     };
      //     request.onerror = () =>
      //       reject("Failed to retrieve images from IndexedDB");
      //     db.close();
      //   });
      // } catch (dbErr) {
      //   console.error("Error opening IndexedDB or retrieving images:", dbErr);
      // }

      // if (images.length > 0) {
      //     '"preSavedBodyRef" before replacing images:',
      //     preSavedBodyRef
      //   );
      images = jsonArticle.filter((item: any) => item.type === "image");

      for (const image of images) {
        // const regex = '<img src="{image_url_placeholder}">';
        // Create a regex to match the <img> tag and its associated <p> tag with the image.fileName
        const regex = new RegExp(
          `<img\\s+src=["']\\{image_url_placeholder\\}["'][^>]*>\\s*<p[^>]*>${image.id}</p>`,
          "g"
        );

        // Only generate blobUrl for valid images
        // const blobUrl = URL.createObjectURL(image.data);

        preSavedBodyRef = preSavedBodyRef.replace(
          regex,
          `<img src="${image.blobUrl}" alt="${image.id}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${image.id}</p>`
        );
      }
      //}
    } catch (err) {
      console.error("Error loading images from IndexedDB:", err);
    }
    //-------------------------------------------------------------------------------------
    // Replace tags with line breaks
    //-------------------------------------------------------------------------------------
    preSavedBodyRef = preSavedBodyRef
      .replace(/<div>/g, "")
      .replace(/<\/div>/g, "")
      .replace(/<br\s*\/?>/g, "___LINE_BREAK___")
      // .replace(/<(?!img|span|a\\b)[^>]*>/g, "")
      .replace(/___LINE_BREAK___/g, "<br>");

    // Update the body reference
    savedBodyRef.current = preSavedBodyRef;
    // if (tag === "draft") {

    setDraftArticleButtonClicked!(true);
    //}
  }
};
