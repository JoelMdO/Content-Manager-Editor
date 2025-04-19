import callHub from "@/services/api/call_hub";
import { debounce} from "lodash";

export default function debouncedSearch( val: string, setEntries: (entries: any) => void, setZeroSearchData: (isZeroSearchData: boolean) => void, entries: any[]) {
  const debouncedFunction = debounce(async (val: string) => {
    
    const response = await callHub("playbook-search-bar", val);
    if (response.status === 200) {
  
      setEntries(response.body);
      setZeroSearchData(false);
    } else {
      if (entries.length <= 0) {
        setZeroSearchData(true);
      }
    }
  }, 500);

  debouncedFunction(val);
}