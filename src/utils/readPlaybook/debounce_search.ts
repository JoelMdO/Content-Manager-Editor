import callHub from "@/services/api/call_hub";
import { PlaybookMeta } from "../../types/plabookMeta";
import { debounce } from "lodash";

const debouncedFunction = debounce(
  async (
    val: string,
    setEntries: (entries: PlaybookMeta[] | undefined) => void,
    setZeroSearchData: (isZeroSearchData: boolean) => void,
    entries: PlaybookMeta[]
  ) => {
    const response = await callHub("playbook-search-bar", val);

    if (response.status === 200) {
      setEntries(response.body);
      setZeroSearchData(false);
    } else {
      if (entries.length <= 0) {
        setZeroSearchData(true);
      }
    }
  },
  500
);

export default function debouncedSearch(
  val: string,
  setEntries: (entries: PlaybookMeta[] | undefined) => void,
  setZeroSearchData: (isZeroSearchData: boolean) => void,
  entries: PlaybookMeta[]
) {
  debouncedFunction(val, setEntries, setZeroSearchData, entries);
}
