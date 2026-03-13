// import { useEditorStore } from "@/store/useEditorStore";
// import { useDraftStore } from "@/store/useDraftStore";
// import { useEffect } from "react";
// import { StorageItem } from "@/types/storage_item";
// // NOTE: This hook is currently unused (not called from any component).
// // Migrated from MenuContext to Zustand stores for forward compatibility.

// export function useGetInitialArticleDraft() {
//   // CHANGE LOG
//   // Changed by : Copilot
//   // Date       : 2026-03-11
//   // Reason     : Migrated from MenuContext to Zustand stores.
//   //              Also fixed pre-existing bug: dbNameToSearch was a Ref object,
//   //              causing template literals to produce "[object Object]" keys.
//   //              Now uses dbName string from useDraftStore.
//   // Impact     : MenuContext no longer needed in this file.
//   //
//   // ORIGINAL: const { savedTitleRef, savedBodyRef, dbNameToSearch, DRAFT_KEY }
//   //   = useContext(MenuContext) as ButtonProps;
//   const { savedTitleRef, savedBodyRef } = useEditorStore.getState();
//   const DRAFT_KEY = useDraftStore((s) => s.DRAFT_KEY);
//   const dbName = useDraftStore((s) => s.dbName);
//   ///
//   ///======================================================
//   // Check if an article is already created on page load
//   // Store articleID in a ref to persist across renders
//   ///======================================================
//   useEffect(() => {
//     let articleStored: string | null = sessionStorage.getItem(
//       `articleContent-${dbName}`,
//     );

//     if (!articleStored) {
//       articleStored = localStorage.getItem(DRAFT_KEY);
//     }
//     if (articleStored) {
//       const jsonArticle = JSON.parse(articleStored);

//       savedTitleRef.current =
//         jsonArticle.find((item: StorageItem) => item.type === "title")
//           ?.content || "";
//       savedBodyRef.current =
//         jsonArticle.find((item: StorageItem) => item.type === "body")
//           ?.content || "";

//       sessionStorage.removeItem(`tempTitle-${dbName}`);
//       sessionStorage.removeItem(`tempBody-${dbName}`);
//       sessionStorage.removeItem(`articleContent-${dbName}`);
//     }
//   }, [dbName, DRAFT_KEY, savedTitleRef, savedBodyRef]);

//   return { savedTitleRef, savedBodyRef };
// }
