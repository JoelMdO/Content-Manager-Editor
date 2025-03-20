const saveImageTemporally = async (file: File) => 
    new Promise((resolve, reject) => {
    // Open the IndexedDB with the name "imageStore" and version 1
    const request = window.indexedDB.open("imageStore", 1);
    if (!window.indexedDB) {
        console.error("IndexedDB is not supported by your browser.");
    }
    //
    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("images", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const reader = new FileReader();
        let added: boolean = false;
        reader.onload = (e) => {
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");
            // Convert Base64 to Blob
            const result = e.target?.result;
            if (typeof result === 'string') {
                const byteCharacters = atob(result.split(',')[1]); 
                const byteArrays = [];
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteArrays.push(byteCharacters.charCodeAt(i));
                }
                const byteArray = new Uint8Array(byteArrays);
                const blob = new Blob([byteArray], { type: file.type });

                // Convert Blob to File
                const imageFile = new File([blob], file.name, { type: file.type });
                store.put({ id: file.name, data: imageFile });
                added = true;
            } else {
                reject({status: 205, message: `Error reading file data`});
            }
        transaction.oncomplete = () => {
            if(added) {
                console.log(`Transaction completed: Image saved to the IndexedDB`);
                resolve({status: 200, message: `Image saved to the IndexedDB ${file.name}`});
            } else {
                reject({status: 205, message: `Error saving image to the IndexedDB`});
            }
        };
        transaction.onerror = () => {
                reject({status: 205, message: `Error saving image to the IndexedDB`});
        };
    };

    reader.readAsDataURL(file);
    };

    request.onerror = (event) => {
        reject ({status: 205, message: `Error saving image to the IndexedDB ${event}`});
    };
    

    
    return {status: 200, message: `Image saved to the IndexedDB`};
});

export default saveImageTemporally;