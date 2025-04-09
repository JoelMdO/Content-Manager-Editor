import callHub from "@/services/api/call_hub";
import { debounce } from "lodash";

import { useMemo } from "react";

export default function debouncedSearch({ val }: { val: string }) {
  return useMemo(
    () =>
      debounce(async (val) => {
        console.log("Calling hub with:", val);
        const response = await callHub("playbook-search", val);
        return {status: response.status, message: response.message};
      }, 300),
    [callHub]
  );
}