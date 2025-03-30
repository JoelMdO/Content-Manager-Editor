export const handleSave = (debouncedUpdateStore: any) => {
  ///========================================================
  // After the data has been sent to the database, flush the debounced store
  ///========================================================
  console.log('called handleSave');
  
    debouncedUpdateStore.flush(); // Immediately executes pending updates
};