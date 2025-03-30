const deleteImageFromIndexDB = async (fileName?: string, type?: string) => 
    new Promise((resolve, reject) => {
    ///========================================================
    // Function to delete an image from the IndexedDB
    ///========================================================
    // Open the IndexedDB with the name "imageStore" and version 1
    const request = window.indexedDB.open("imageStore", 1);
    //
    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
    }};

    request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        /// ---------------------------------------------------------
        /// Delete all images from indexDb
        /// ---------------------------------------------------------
        if(type === "clear-all"){
            const getAllKeysRequest = store.getAllKeys();
            getAllKeysRequest.onsuccess = () => {
                const keys = getAllKeysRequest.result;
                if (keys.length === 0) {
                    resolve({ status: 200, message: "No images found in IndexedDB" });
                    return;
                }

                // Delete each image
                keys.forEach((key) => {
                    const deleteRequest = store.delete(key);
                    deleteRequest.onsuccess = () => ("");
                    deleteRequest.onerror = () => ""
                });

                resolve({ status: 200, message: `Deleted ${keys.length} images from IndexedDB` });
            };

            getAllKeysRequest.onerror = () => {
                reject({ status: 500, message: "Error retrieving images from IndexedDB" });
            };
        }else {
        /// ---------------------------------------------------------
        /// Delete only the selected image from indexDb
        /// ---------------------------------------------------------
        const deleteRequest = store.delete(fileName!);

        deleteRequest.onsuccess = () => "";
        resolve({ status: 200, message: `Image deleted from IndexedDB: ${fileName}` });
        
        deleteRequest.onerror = () => reject({status: 205, message: `Error deleting image from the IndexedDB`});

        request.onerror = (event) => {
        reject ({status: 205, message: `Error deleting image to the IndexedDB ${event}`});
        };} 
}});

export default deleteImageFromIndexDB;