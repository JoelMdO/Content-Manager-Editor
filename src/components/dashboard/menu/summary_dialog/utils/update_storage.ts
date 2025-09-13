function updateStorage(
  storage: Storage, // pass sessionStorage or localStorage
  key: string,
  type: string,
  newContent: string
) {
  const existing = storage.getItem(key);
  if (!existing) return;

  let arr = JSON.parse(existing);
  if (!Array.isArray(arr)) return;

  arr = arr.map((item) =>
    item.type === type ? { ...item, content: newContent } : item
  );

  storage.setItem(key, JSON.stringify(arr));
}
export default updateStorage;
