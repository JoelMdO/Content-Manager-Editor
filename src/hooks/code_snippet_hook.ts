import { useCallback, useState } from "react";
import { sanitizeData } from "../utils/sanitize/data/sanitize_data";
import errorAlert from "@/components/alerts/error";
import { CodeSnippet } from "@/types/codesnippet";

export const useCodeSnippets = () => {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);

  const addCodeSnippet = useCallback(() => {
    const snippet: CodeSnippet = { language: "", code: "", image: "" };
    setCodeSnippets((prev) => [...prev, snippet]);
  }, []);

  const removeCodeSnippet = useCallback((index: number) => {
    setCodeSnippets((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateCodeSnippet = useCallback(
    (index: number, field: string, value: string) => {
      //
      const existingSnippet = codeSnippets[index] ?? {
        language: "",
        code: "",
        image: "",
      };
      const updatedSnippets = [...codeSnippets];

      //
      updatedSnippets[index] = {
        ...existingSnippet,
        [field]: value,
      };
      setCodeSnippets(updatedSnippets);
    },
    [codeSnippets]
  );

  const updateCodeSnippetPaste = async (
    index: number,
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const updatedSnippets = [...codeSnippets];
            updatedSnippets[index] = {
              ...updatedSnippets[index],
              image: reader.result as string,
            };
            setCodeSnippets(updatedSnippets);
          };
          reader.readAsDataURL(file); // Convert image to base64
        }
        event.preventDefault(); // Prevent default paste behavior
        return;
      } else {
        const data = item.getAsString.name;
        const response = await sanitizeData(data, "text");
        if (response.status === 200) {
          const updatedSnippets = [...codeSnippets];
          updatedSnippets[index] = {
            ...updatedSnippets[index],
            code: data,
            image: updatedSnippets[index].image || "",
          };
          setCodeSnippets(updatedSnippets);
        } else {
          errorAlert("Snippet Paste", "non200", "Link not valid");
        }
      }
    }
  };

  return {
    codeSnippets,
    addCodeSnippet,
    removeCodeSnippet,
    updateCodeSnippet,
    updateCodeSnippetPaste,
  };
};
