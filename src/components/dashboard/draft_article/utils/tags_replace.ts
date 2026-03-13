import { StorageItem } from "@/types/storage_item";
import { cleanNestedDivs } from "../../utils/clean_content";
import { hydrateImagesInHTML } from "@/lib/imageStore/hydrateImages";
import { useDraftStore } from "@/store/useDraftStore";

export const tagsReplace = async ({ dbName }: { dbName: string }) => {
  const DRAFT_KEY = `draft-articleContent-${dbName}`;
  const articleStored = localStorage.getItem(DRAFT_KEY!);
  const jsonArticle = JSON.parse(articleStored!);

  let preSavedBodyRef =
    jsonArticle.find((item: StorageItem) => item.type === "es-body")?.content ||
    "";
  const title =
    jsonArticle.find((item: StorageItem) => item.type === "es-title")
      ?.content || "";
  //console.log("preSavedBodyRef before image processing:", preSavedBodyRef);

  //-------------------------------------------------------------------------------------
  // Replace tags with line breaks
  //-------------------------------------------------------------------------------------
  preSavedBodyRef = preSavedBodyRef
    .replace(/<div>/g, "")
    .replace(/<\/div>/g, "")
    .replace(/<br\s*\/?>/g, "___LINE_BREAK___")
    .replace(/___LINE_BREAK___/g, "<br>");

  // Update the body reference
  const cleanedBody = cleanNestedDivs(preSavedBodyRef);
  //console.log("Cleaned body on draft after cleanNestedDivs:", cleanedBody);

  // Replace <img ... data-ref-id> tags with blob URLs from IndexedDB
  // so the editor receives HTML with valid src attributes.
  let hydratedBody = cleanedBody;
  try {
    hydratedBody = await hydrateImagesInHTML(cleanedBody);
    console.log("hydratedBody after hydrateImagesInHTML:", hydratedBody);
  } catch (e) {
    console.warn("[handleClick] hydrateImagesInHTML failed:", e);
  }

  useDraftStore.getState().loadDraftIntoEditor(
    title ?? "",
    // pass hydrated HTML (blob URLs inserted) to the editor
    typeof hydratedBody === "string" ? hydratedBody : cleanedBody,
  );

  // OR
  //   try {
  //           titleEditorRef.current?.commands.setContent(titleHtml, { emitUpdate: false });
  //           bodyEditorRef.current?.commands.setContent(hydratedBody, { emitUpdate: false });
  //           console.log("[syncFromSession] setContent called on editors");
  //         } catch (e) {
  //           console.warn("[useDraftStore.syncFromSession] failed to set editor content:", e);
  //         }
};
