export const handleSave = (debouncedUpdateStore: any) => {
    debouncedUpdateStore.flush(); // Immediately executes pending updates
};