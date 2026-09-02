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
