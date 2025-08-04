const saveImageTemporally = async (file: File, imageId: string) =>
  new Promise((resolve, reject) => {
    ///========================================================
    // Function to save an image to the IndexedDB
    ///========================================================
    // Open the IndexedDB with the name "imageStore" and version 1
    //indexedDB.deleteDatabase("imageStore");
    try {
      const request = window.indexedDB.open("imageStore", 1);
      if (!window.indexedDB) {
        reject({ status: 205, message: `Store index not supported` });
        return { status: 400, message: "IndexedDB not supported" };
      }
      //
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("_meta")) {
          db.createObjectStore("_meta", { keyPath: "key" });
        }

        const metaTransaction = (
          event.target as IDBOpenDBRequest
        ).result.transaction("_meta", "readwrite");
        const metaStore = metaTransaction.objectStore("_meta");
        metaStore.put({ key: "schemaVersion", value: 1 });
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const versionCheckTx = db.transaction("_meta", "readonly");
        const metaStore = versionCheckTx.objectStore("_meta");
        const versionRequest = metaStore.get("schemaVersion");

        versionRequest.onsuccess = () => {
          const schemaVersion = versionRequest.result;
          if (schemaVersion !== 1) {
            console.warn(
              "Unexpected schema version. Expected 1, found:",
              schemaVersion
            );
          }
        };

        versionRequest.onerror = () => {
          console.warn("Could not read schemaVersion from _meta store.");
        };

        const reader = new FileReader();
        let added: boolean = false;
        reader.onload = (e) => {
          const transaction = db.transaction("images", "readwrite");
          const store = transaction.objectStore("images");
          // Convert Base64 to Blob
          const result = e.target?.result;
          if (typeof result === "string") {
            const byteCharacters = atob(result.split(",")[1]);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
              byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const byteArray = new Uint8Array(byteArrays);
            const blob = new Blob([byteArray], { type: file.type });

            // Convert Blob to File
            const imageFile = new File([blob], file.name, { type: file.type });
            store.put({ id: imageId, fileName: file.name, data: imageFile });
            added = true;
          } else {
            reject({ status: 205, message: `Error reading file data` });
            db.close();
          }
          transaction.oncomplete = () => {
            if (added) {
              resolve({
                status: 200,
                message: `Image saved to the IndexedDB ${file.name}`,
              });
              db.close();
            } else {
              reject({
                status: 205,
                message: `Error saving image to the IndexedDB`,
              });
              db.close();
            }
          };
          transaction.onerror = () => {
            reject({
              status: 205,
              message: `Error saving image to the IndexedDB`,
            });
            db.close();
          };
        };

        reader.readAsDataURL(file);
      };

      request.onerror = async (event) => {
        const error = (event.target as IDBOpenDBRequest | null)?.error;
        const versionError =
          error &&
          (error.name === "VersionError" || error.name === "InvalidStateError");

        if (versionError) {
          console.warn(
            "[IndexedDB] Detected version error. Attempting DB reset..."
          );

          // Attempt to read existing data from the old DB
          let previousImages: any[] = [];
          try {
            const legacyRequest = indexedDB.open("imageStore");
            legacyRequest.onsuccess = () => {
              const legacyDb = legacyRequest.result;
              if (legacyDb.objectStoreNames.contains("images")) {
                const tx = legacyDb.transaction("images", "readonly");
                const store = tx.objectStore("images");
                const getAllReq = store.getAll();
                getAllReq.onsuccess = () => {
                  previousImages = getAllReq.result;
                  legacyDb.close();

                  // Proceed to delete the DB
                  const deleteRequest = indexedDB.deleteDatabase("imageStore");
                  deleteRequest.onsuccess = () => {
                    console.log("[IndexedDB] DB deleted. Recreating...");

                    const recreateRequest = indexedDB.open("imageStore", 1);
                    recreateRequest.onupgradeneeded = (event) => {
                      const db = (event.target as IDBOpenDBRequest).result;
                      db.createObjectStore("images", { keyPath: "id" });
                      const metaStore = db.createObjectStore("_meta", {
                        keyPath: "key",
                      });
                      metaStore.transaction.oncomplete = () => {
                        const tx = db.transaction("_meta", "readwrite");
                        const store = tx.objectStore("_meta");
                        store.put({ key: "schemaVersion", value: 1 });
                      };
                    };

                    recreateRequest.onsuccess = (event) => {
                      const db = (event.target as IDBOpenDBRequest).result;

                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result;
                        if (typeof result !== "string") {
                          reject(
                            new Error(
                              JSON.stringify({
                                status: 400,
                                message: "Failed to read file as base64 string",
                              })
                            )
                          );
                          db.close();
                          return;
                        }

                        const byteCharacters = atob(result.split(",")[1]);
                        const byteArrays = [];
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteArrays.push(byteCharacters.charCodeAt(i));
                        }
                        const byteArray = new Uint8Array(byteArrays);
                        const blob = new Blob([byteArray], { type: file.type });
                        const imageFile = new File([blob], file.name, {
                          type: file.type,
                        });

                        const tx = db.transaction("images", "readwrite");
                        const store = tx.objectStore("images");

                        store.put({
                          id: imageId,
                          fileName: file.name,
                          data: imageFile,
                        });

                        // Restore previous images (if any)
                        previousImages
                          .filter((item) => item.id !== imageId)
                          .forEach((img) => store.put(img));

                        tx.oncomplete = () => {
                          resolve({
                            status: 200,
                            message: `Image saved with recovery`,
                          });
                          db.close();
                        };

                        tx.onerror = () => {
                          reject(
                            new Error(
                              JSON.stringify({
                                status: 500,
                                message:
                                  "Failed to restore images after DB reset",
                              })
                            )
                          );
                          db.close();
                        };
                      };

                      reader.readAsDataURL(file);
                    };

                    recreateRequest.onerror = () => {
                      reject(
                        new Error(
                          JSON.stringify({
                            status: 500,
                            message: "Failed to recreate IndexedDB",
                          })
                        )
                      );
                    };
                  };

                  deleteRequest.onerror = () => {
                    reject(
                      new Error(
                        JSON.stringify({
                          status: 500,
                          message:
                            "Failed to delete IndexedDB after version error",
                        })
                      )
                    );
                  };
                };

                getAllReq.onerror = () => {
                  legacyDb.close();
                  reject(
                    new Error(
                      JSON.stringify({
                        status: 500,
                        message: "Failed to retrieve previous images",
                      })
                    )
                  );
                };
              } else {
                legacyDb.close();
                // If no image store exists, proceed with delete
                const deleteRequest = indexedDB.deleteDatabase("imageStore");
                deleteRequest.onsuccess = () =>
                  saveImageTemporally(file, imageId)
                    .then(resolve)
                    .catch(reject);
                deleteRequest.onerror = () =>
                  reject(
                    new Error(
                      JSON.stringify({
                        status: 500,
                        message: "DB delete failed",
                      })
                    )
                  );
              }
            };

            legacyRequest.onerror = () => {
              reject(
                new Error(
                  JSON.stringify({
                    status: 500,
                    message: "Failed to open legacy DB for backup",
                  })
                )
              );
            };
          } catch (err) {
            reject(
              new Error(
                JSON.stringify({
                  status: 500,
                  message: "Unexpected error during DB recovery",
                })
              )
            );
          }

          return;
        }

        const serialized = JSON.stringify({
          status: 205,
          message: `Error opening IndexedDB: ${
            error ? error.message : "unknown error"
          }`,
        });
        console.warn("Rejecting with serialized error:", serialized);
        reject(new Error(serialized));
      };

      return { status: 200, message: `Image saved to the IndexedDB` };
    } catch (error) {
      //console.error("Error during IndexedDB operation:", error);
      //console.error("Error details:", JSON.stringify(error, null, 2));
      const parsed = JSON.parse(error as string);
      console.error("Custom IndexedDB error:", parsed);
      return { status: 500, message: `Error saving image ${parsed}` };
    }
  });

export default saveImageTemporally;
