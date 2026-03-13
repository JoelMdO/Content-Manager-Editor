// CHANGE LOG
// Created by : Copilot
// Date       : 2026-03-11
// Reason     : Phase 5 — replace base64-in-sessionStorage with raw Blob in
//              IndexedDB. Storing base64 strings was exhausting the ~5 MB
//              sessionStorage quota for images >3-4 MB. Raw Blobs in IDB have
//              no practical size limit and survive hard reloads (unlike
//              blob: URLs created with URL.createObjectURL()).
// Impact     : upload_image.ts, create_formData.ts, delete_img_from_localstorage.ts,
//              handle_keyboard_actions.ts all updated to call this module.
//
import { openDB, deleteDB, IDBPDatabase } from "idb";

const DB_NAME = "imageStore";
const STORE_NAME = "blobs";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch(async (err: unknown) => {
      // If the stored DB version is higher than DB_VERSION (e.g. from a
      // previous dev session), delete and recreate. Blobs are session-scoped
      // so data loss here is acceptable.
      if (err instanceof DOMException && err.name === "VersionError") {
        dbPromise = null;
        await deleteDB(DB_NAME);
        return openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            db.createObjectStore(STORE_NAME);
          },
        });
      }
      throw err;
    });
  }
  return dbPromise;
}

/** Persist a raw Blob under the given imageId key. */
export async function storeBlob(imageId: string, blob: Blob): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, blob, imageId);
}

/** Retrieve a previously stored Blob (returns undefined if not found). */
export async function getBlob(imageId: string): Promise<Blob | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, imageId);
}

/** Remove a Blob from the store. */
export async function deleteBlob(imageId: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, imageId);
}

/**
 * Convert a Blob to a base64 data-URL string.
 * Used at publish time to feed the existing Cloudinary upload flow.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
