import callHub from "@/services/api/call_hub";
import { PlaybookMeta } from "../../types/plabookMeta";

async function handleSelectChange(
  selectedValue: string,
  setEntries: (entries: PlaybookMeta[] | undefined) => void,
  setZeroSearchData: (isZeroSearchData: boolean) => void
) {
  setEntries([]);
  if (selectedValue === "Select") {
    setZeroSearchData(false);
  } else {
    const response = await callHub("playbook-search-category", selectedValue);
    if (response.status === 200) {
      setEntries(response.body as PlaybookMeta[] | undefined);
      setZeroSearchData(false);
    } else {
      setZeroSearchData(true);
    }
  }
}

export default handleSelectChange;
