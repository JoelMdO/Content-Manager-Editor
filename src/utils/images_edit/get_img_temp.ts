
const getImageTemporally = async (fileName: string) => {
    return new Promise((resolve: any, reject: any) => {
    ///========================================================
    // Function to get an image from the IndexedDB
    ///========================================================
    // Open the IndexedDB with the name "imageStore" and version 1
    const request = window.indexedDB.open("imageStore", 1);
    //
    try{
    request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!window.indexedDB) {
        console.error("IndexedDB is not supported by your browser.");
    }
    //
    // Check if "images" store exists before querying
    if (!db.objectStoreNames.contains("images")) {
        reject({ status: 205, message: "Object store 'images' not found", file: null });
        return;
    }
    //
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    const getRequest = store.get(fileName);
    let file: File | null = null;

    getRequest.onsuccess = (e) => {
        if ((e.target as IDBRequest).result) {
            file = (e.target as IDBRequest).result.data; // This is the data URL
            resolve({status: 200, message: `Image read from the IndexedDB`, file: file});
        } else {
            file= null;
            reject({status: 205, message: "Failed to open IndexedDB", file: null});
            };
        }
    getRequest.onerror = () => {
        return {status: 205, message:"Error retrieving image", file: null};
    };
    }} catch (error) {
    console.error(error);
    return {status: 500, message: error };
}})};

export default getImageTemporally;