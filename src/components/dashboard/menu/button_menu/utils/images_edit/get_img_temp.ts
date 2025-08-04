const getImageTemporally = async (fileName: string) => {
  return new Promise<{ status: number; message: string; file: File | null }>(
    (resolve, reject) => {
      ///========================================================
      // Function to get an image from the IndexedDB
      ///========================================================
      // Open the IndexedDB with the name "imageStore" and version 1
      // const request = window.indexedDB.open("imageStore", 1);
      const request = window.indexedDB.open("imageStore", 1);
      console.log("Opening IndexedDB with request:", request);

      //
      try {
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!window.indexedDB) {
            console.log('"IndexedDB not supported in this browser."');
          }
          //
          // Check if "images" store exists before querying
          if (!db.objectStoreNames.contains("images")) {
            reject({
              status: 205,
              message: "Object store 'images' not found",
              file: null,
            });
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
              resolve({
                status: 200,
                message: `Image read from the IndexedDB`,
                file: file,
              });
              console.log("on success", file);
            } else {
              file = null;
              reject({
                status: 205,
                message: "Failed to open IndexedDB",
                file: null,
              });
              console.log("on error at else", file);
            }
          };
          getRequest.onerror = () => {
            reject({
              status: 205,
              message: "Error retrieving image",
              file: null,
            });
            console.log("on error", file);
          };
        };
      } catch (error) {
        console.log("#catch error", error);

        reject({ status: 500, message: String(error), file: null });
      }
    }
  );
};

export default getImageTemporally;
