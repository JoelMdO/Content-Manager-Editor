import { useCallback, useState } from "react";
import insertLink from "../dashboard/insert_link";
import { sanitizeData } from "../dashboard/sanitize";
import errorAlert from "@/components/alerts/error";

export type CodeSnippet = {
  language: string;
  code: string;
  image?: string;
};

export const useCodeSnippets = () => {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);

  const addCodeSnippet = useCallback(() => {
    const snippet: CodeSnippet = { language: '', code: '', image: ''};
    setCodeSnippets(prev => [...prev, snippet]);
  }, []);

  const removeCodeSnippet = useCallback((index: number) => {
    setCodeSnippets(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateCodeSnippet = useCallback((index: number, field: string, value: string) => {
    // 
    const existingSnippet = codeSnippets[index] ?? { language: "", code: "", image: "" };
    const updatedSnippets = [...codeSnippets];
    //
    updatedSnippets[index] = {
      ...existingSnippet,
      [field]: value
    };
    setCodeSnippets(updatedSnippets)
  }, []);

  const updateCodeSnippetPaste = async (index: number, event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault(); // Prevent default paste behavior
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const updatedSnippets = [...codeSnippets];
            updatedSnippets[index] = { ...updatedSnippets[index], code: updatedSnippets[index].code || "", image: reader.result as string };
            setCodeSnippets(updatedSnippets);
          };
          reader.readAsDataURL(file); // Convert image to base64
        }
        return;
      } else {
        item.getAsString(async (data) => {
          const response = await sanitizeData(data, "text"); 
          if (response.status === 200) {
            const updatedSnippets = [...codeSnippets];
            updatedSnippets[index] = { ...updatedSnippets[index], code: response.message, image: updatedSnippets[index].image || "",  };
            setCodeSnippets(updatedSnippets);
          } else {
            errorAlert("Snippet Paste", "non200", "Link not valid");
            console.error(response.message);
          }
        });
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