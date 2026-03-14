import { StorageItem } from "../../../../types/storage_item";

export interface IStorageProvider {
  readDraft(dbName: string): Promise<StorageItem[]>;
}

export class LocalStorageProvider implements IStorageProvider {
  async readDraft(dbName: string): Promise<StorageItem[]> {
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
  async readDraft(dbName: string): Promise<StorageItem[]> {
    try {
      const raw = sessionStorage.getItem(`articleContent-${dbName}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[SessionStorageProvider] failed to parse draft", e);
      return [];
    }
  }
}
