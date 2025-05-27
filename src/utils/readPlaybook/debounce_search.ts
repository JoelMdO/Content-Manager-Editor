import callHub from "@/services/api/call_hub";
import { debounce } from "lodash";

const debouncedFunction = debounce(
  async (
    val: string,
    setEntries: (entries: any) => void,
    setZeroSearchData: (isZeroSearchData: boolean) => void,
    entries: any[]
  ) => {
    console.log("val at debouncedFunction:", val);

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
  setEntries: (entries: any) => void,
  setZeroSearchData: (isZeroSearchData: boolean) => void,
  entries: any[]
) {
  debouncedFunction(val, setEntries, setZeroSearchData, entries);
}
