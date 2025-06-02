import { PlaybookMeta } from "../../types/plabookMeta";
import debouncedSearch from "./debounce_search";

async function handleInputChange(
  selectValue: string,
  setSearchTerm: (selectValue: string) => void,
  setEntries: (entries: PlaybookMeta[] | undefined) => void,
  setZeroSearchData: (isZeroSearchData: boolean) => void,
  entries: PlaybookMeta[]
) {
  setEntries([]);
  setSearchTerm(selectValue);
  debouncedSearch(selectValue, setEntries, setZeroSearchData, entries);
}

export default handleInputChange;
