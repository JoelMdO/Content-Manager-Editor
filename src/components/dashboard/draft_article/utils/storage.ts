import { StorageArticle } from "../../../../types/storage_item";

export interface IStorageProvider {
  readDraft(dbName: string): Promise<StorageArticle[]>;
}

export class LocalStorageProvider implements IStorageProvider {
  async readDraft(dbName: string): Promise<StorageArticle[]> {
    try {
      const raw = localStorage.getItem(`draft-articleContent-${dbName}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[LocalStorageProvider] failed to parse draft", e);
      return [];
    }
  }

  async readIfDraftAvaiable(): Promise<
    { dbName: string; content: string } | "No Draft Available"
  > {
    try {
      const rawDeCav = localStorage.getItem("draft-articleContent-DeCav");
      //console.log("Raw DeCav draft:", rawDeCav);
      if (rawDeCav) {
        const raw = JSON.parse(rawDeCav);
        const articleTitle = raw.find(
          (item: StorageArticle) => item.type === "title",
        );
        //console.log("Parsed DeCav draft:", articleTitle);
        //console.log("Parsed DeCav draft content:", articleTitle?.content);
        return {
          dbName: "DeCav",
          content: articleTitle?.content
            .replace(/<\/?p[^>]*>/gi, "")
            .toLocaleUpperCase(),
        };
      } else if (localStorage.getItem("draft-articleContent-Joel")) {
        const rawJoel = localStorage.getItem("draft-articleContent-Joel");
        //console.log("Raw Joel draft:", rawJoel);
        if (rawJoel) {
          const raw = JSON.parse(rawJoel);
          const articleTitle = raw.find(
            (item: StorageArticle) => item.type === "title",
          );
          //console.log("Parsed Joel draft:", articleTitle);
          return {
            dbName: "Joel",
            content: articleTitle?.content
              .replace(/<\/?p[^>]*>/gi, "")
              .toLocaleUpperCase(),
          };
        } else {
          return "No Draft Available";
        }
      } else {
        return "No Draft Available";
      }
    } catch (e) {
      console.warn("[LocalStorageProvider] failed to parse draft", e);
      return "No Draft Available";
    }
  }
}

export class SessionStorageProvider implements IStorageProvider {
  async readDraft(dbName: string): Promise<StorageArticle[]> {
    try {
      const raw = sessionStorage.getItem(`articleContent-${dbName}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[SessionStorageProvider] failed to parse draft", e);
      return [];
    }
  }
}
