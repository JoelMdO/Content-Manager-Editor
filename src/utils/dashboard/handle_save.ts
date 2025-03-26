export const handleSave = (debouncedUpdateStore: any) => {
    console.log("Button clicked, flushing debounce");
    debouncedUpdateStore.flush(); // Immediately executes pending updates
};