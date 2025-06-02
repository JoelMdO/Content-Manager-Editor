import { DebouncedFunc } from "lodash";

export const handleSave = (debouncedUpdateStore: DebouncedFunc<() => void>) => {
  ///========================================================
  // After the data has been sent to the database, flush the debounced store
  ///========================================================
  debouncedUpdateStore.flush(); // Immediately executes pending updates
};
