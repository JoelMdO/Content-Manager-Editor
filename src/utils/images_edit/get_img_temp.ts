
const getImageTemporally = async (fileName: string) => {
    return new Promise((resolve: any, reject: any) => {
    // Open the IndexedDB with the name "imageStore" and version 1
    const request = window.indexedDB.open("imageStore", 1);
    console.log('fileName at get image temporally', fileName);
    //
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
        console.log('getRequest at get image temporally');
        if ((e.target as IDBRequest).result) {
            file = (e.target as IDBRequest).result.data; // This is the data URL
            resolve({status: 200, message: `Image read from the IndexedDB`, file: file});
        } else {
            console.log('getRequest NOT success at get image temporally');
            file= null;
            reject({status: 205, message: "Failed to open IndexedDB", file: null});
            };
        }
    getRequest.onerror = () => {
        console.log('getRequest error at get image temporally');
        return {status: 205, message:"Error retrieving image", file: null};
    };
    }} catch (error) {
    console.error(error);
    return {status: 500, message: error };
}})};

export default getImageTemporally;