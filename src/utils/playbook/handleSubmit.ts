import errorAlert from "@/components/alerts/error";
import successAlert from "@/components/alerts/sucess";
import callHub from "@/services/api/call_hub";
import { CodeSnippet } from "../../types/codesnippet";
import { Reference } from "../../types/references";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsSaving: (isSaving: boolean) => void,
  setSaveSuccess: (success: boolean) => void,
  title: string,
  category: string,
  tags: string[],
  steps: string[] | undefined,
  notes: string,
  codeSnippets: CodeSnippet[],
  references: Reference[],
  resetForm: () => void,
  router?: AppRouterInstance
) => {
  e.preventDefault();
  setIsSaving(true);
  //
  const today = new Date();
  const dateFormatted = today.toLocaleString("en-EN", {
    timeZone: "Europe/Moscow", // UTC+3
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const lastUpdateNumber = parseInt(
    `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`
  );

  const data = {
    title,
    category,
    tags,
    steps,
    notes,
    codeSnippets,
    references,
    lastUpdated: dateFormatted,
    useRecord: lastUpdateNumber,
  };
  //
  const response = await callHub("playbook-save", data);
  //
  if (response.status === 200) {
    setIsSaving(false);
    setSaveSuccess(true);
    successAlert("playbook", undefined, resetForm, router);
    // Reset success message after 2 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  } else {
    setIsSaving(false);
    if (response.message === "Reauthentication failed") {
      const dataString = JSON.stringify(data);
      sessionStorage.setItem("playbook-item", dataString);
      errorAlert("Saving data Playbook", "playbook", "Reauthentication failed");
      router!.push("/");
    } else {
      errorAlert("Saving data Playbook", "non200", response.message);
    }
  }
};

export default handleSubmit;
