import callHub from "@/services/api/call_hub";
import { log } from "node:console";


async function handleSelectChange(selectedValue: string, setEntries:(entries: any)=>void, setZeroSearchData: (isZeroSearchData: boolean)=> void, entries: any[]) {
    
    setEntries([]);
    const response = await callHub("playbook-search-category", selectedValue);
    if (response.status === 200) {

      setEntries(response.body);
      setZeroSearchData(false);

    } else {
        setZeroSearchData(true);
      }
  };

  export default handleSelectChange;
