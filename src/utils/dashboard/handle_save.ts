export const handleSave = (debouncedUpdateStore: any) => {
  ///========================================================
  // After the data has been sent to the database, flush the debounced store
  ///========================================================
    debouncedUpdateStore.flush(); // Immediately executes pending updates
};