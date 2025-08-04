export function removeStoredImage(
  imageIdToRemove: string,
  dbName: string,
  useSession = true
) {
  const deleteData = (key: string, useSession: boolean) => {
    const storage = useSession ? sessionStorage : localStorage;
    const stored = storage.getItem(key);
    if (!stored) return;

    try {
      const content = JSON.parse(stored);
      const filtered = content.filter(
        (item: any) => item.imageId !== imageIdToRemove
      );
      storage.setItem(key, JSON.stringify(filtered));
      console.log(
        `Removed image ${imageIdToRemove} from ${
          useSession ? "session" : "local"
        }Storage.`
      );
    } catch (err) {
      console.error("Error removing image:", err);
    }
  };

  if (dbName === "") {
    const newDbName = ["DeCav", "Joe"];
    const newKeysSessionStorage = [
      "articleContent-DeCav",
      "articleContent-Joe",
    ];
    const newKeysLocalStorage = [
      "draft-articleContent-DeCav",
      "draft-articleContent-Joe",
    ];

    newDbName.forEach((name, index) => {
      deleteData(newKeysSessionStorage[index], true);
      deleteData(newKeysLocalStorage[index], false);
    });
  } else {
    let key = `articleContent-${dbName}`;
    if (!useSession) {
      key = `draft-articleContent-${dbName}`;
    }
    deleteData(key, useSession);
  }
}
