import debouncedSearch from "./debounce_search";

async function handleInputChange(
  selectValue: string,
  setSearchTerm: (selectValue: string) => void,
  setEntries: (entries: any) => void,
  setZeroSearchData: (isZeroSearchData: boolean) => void,
  entries: any[]
) {
  setEntries([]);
  setSearchTerm(selectValue);
  debouncedSearch(selectValue, setEntries, setZeroSearchData, entries);
}

export default handleInputChange;
