function updateStorage(
  storage: Storage, // pass sessionStorage or localStorage
  key: string,
  type: string,
  newContent: string,
) {
  //
  const raw = storage.getItem(key);
  const items = JSON.parse(raw || "{}");
  console.log(
    "Updating storage for key:",
    key,
    "with type:",
    type,
    "and new content:",
    newContent,
  );
  items[type] = newContent;
  console.log("Updated items:", items);
  const localMap = new Map(Object.entries(items));
  console.log("Updated localMap:", localMap);
  storage.setItem(key, JSON.stringify(Object.fromEntries(localMap)));
  // const existing = storage.getItem(key);
  // console.log("Existing storage for key:", key, "is:", existing);
  // if (!existing) return;

  // let arr = JSON.parse(existing);
  // console.log("Parsed storage is:", arr);
  // if (!Array.isArray(arr)) return;
  // console.log(
  //   "Updating storage for key:",
  //   key,
  //   "with type:",
  //   type,
  //   "and new content:",
  //   newContent,
  // );
  // arr = arr.map((item) =>
  //   item.type === type ? { ...item, content: newContent } : item,
  // );

  // storage.setItem(key, JSON.stringify(arr));
}
export default updateStorage;
