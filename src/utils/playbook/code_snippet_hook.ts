import { useCallback, useState } from "react";
import insertLink from "../dashboard/insert_link";
import { sanitizeData } from "../dashboard/sanitize";
import errorAlert from "@/components/alerts/error";
import { debounce } from "lodash";

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
    console.log('snippet existingSnippt', existingSnippet);
      const updatedSnippets = [...codeSnippets];
      console.log('updateSnip-bef', updatedSnippets);
      
      //
      updatedSnippets[index] = {
        ...existingSnippet,
        [field]: value
      };
      console.log('updatedSnip-aft', updatedSnippets);
      setCodeSnippets(updatedSnippets)
  }, []);

  const updateCodeSnippetPaste = async (index: number, event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const updatedSnippets = [...codeSnippets];
            updatedSnippets[index] = { ...updatedSnippets[index], image: reader.result as string };
            setCodeSnippets(updatedSnippets);
          };
          reader.readAsDataURL(file); // Convert image to base64
        }
        event.preventDefault(); // Prevent default paste behavior
        return;
      } else {
        const data = item.getAsString.name;
        console.log('data', data);
        const response = await sanitizeData(data, "text"); 
        if (response.status === 200) {
            const updatedSnippets = [...codeSnippets];
            updatedSnippets[index] = { ...updatedSnippets[index], code: data, image: updatedSnippets[index].image || "",  };
            setCodeSnippets(updatedSnippets);
        } else {
            errorAlert("Snippet Paste","non200", "Link not valid");
            console.error(response.message);
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