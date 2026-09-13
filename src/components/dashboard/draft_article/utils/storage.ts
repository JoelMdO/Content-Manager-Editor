import { ArticleItem, StorageArticle } from "../../../../types/storage_item";

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

  async readIfDraftAvaiable(): Promise<string> {
    try {
      const rawDeCav = localStorage.getItem(`draft-articleContent-${"DeCav"}`);
      if (rawDeCav) {
        const raw = JSON.parse(rawDeCav);
        return raw[0].title;
      } else {
        const rawJoel = localStorage.getItem(`draft-articleContent-${"Joel"}`);
        if (rawJoel) {
          const raw = JSON.parse(rawJoel);
          return raw[0].title;
        } else {
          return "No Draft Available";
        }
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
