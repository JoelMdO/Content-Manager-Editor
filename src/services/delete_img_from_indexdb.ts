const deleteImageFromIndexDB = async (fileName: string) => 
    new Promise((resolve, reject) => {
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
        // let deleted: boolean = false;
        // reader.onload = (e) => {
        //     const transaction = db.transaction("images", "readwrite");
        //     const store = transaction.objectStore("images");
        const deleteRequest = store.delete(fileName);

        deleteRequest.onsuccess = () => console.log(`Image deleted from IndexedDB: ${fileName}`);
        resolve({ status: 200, message: `Image deleted from IndexedDB: ${fileName}` });
        
        deleteRequest.onerror = () => reject({status: 205, message: `Error deleting image from the IndexedDB`});
    //     transaction.oncomplete = () => {
    //         if(deleted) {
    //             console.log(`Transaction completed: Image deleted to the IndexedDB`);
    //             resolve({status: 200, message: `Image deleted to the IndexedDB ${fileName}`});
    //         } else {
    //             reject({status: 205, message: `Error saving image to the IndexedDB`});
    //         }
    //     };
    //     transaction.onerror = () => {
    //             reject({status: 205, message: `Error saving image to the IndexedDB`});
    //     };
    // };
    // };

    request.onerror = (event) => {
        reject ({status: 205, message: `Error deleting image to the IndexedDB ${event}`});
    };
    
    
    // return {status: 200, message: `Image deleted to the IndexedDB`};
}});

export default deleteImageFromIndexDB;