import { useCallback, useState } from "react";
import insertLink from "../dashboard/insert_link";
import errorAlert from "@/components/alerts/error";

export type Reference = {
  title: string;
  link: string;
};

export const useReferences = () => {
  const [references, setReferences] = useState<Reference[]>([]);

    // Add a new reference
    const addReference = useCallback(() => {
        const reference: Reference = { title: '', link: '' };
        setReferences(prev => [...prev, reference]);
    }, []);

    // Remove a reference
    const removeReference = useCallback((index: number) => {
        setReferences(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Update a reference field
    const updateReference = useCallback((index: number, field: string, value: string) => {
        //
        const existingReferences= references[index] ?? { link: "", title: "" };
        const updatedReferences = [...references];
        updatedReferences[index] ={
            ...existingReferences,
            [field]: value,
        }
        setReferences(updatedReferences);
    }
    , []);

    // Handle pasting an image into a reference
    const updateReferencePaste = async (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                errorAlert("Url", "non200", 'Files, Images are NOT allowed to be pasted.');
                const updatedReferences = [...references];
                    updatedReferences[index] = { ...updatedReferences[index], link: "Reference not valid", title: updatedReferences[index].title || "",  };
                    setReferences(updatedReferences);
            } else {
                item.getAsString(async (data) => {
                    const response = await insertLink("playbook", data, undefined); 
                if (response.status === 200) {
                        const link = response.message;
                        const updatedReferences = [...references];
                        updatedReferences[index] = { ...updatedReferences[index], link: link, title: updatedReferences[index].title || "",   };
                        setReferences(updatedReferences);
                    } else {
                        errorAlert("Url", "non200", "Link not valid");
                        const updatedReferences = [...references];
                        updatedReferences[index] = { ...updatedReferences[index], link: "Link not valid", title: updatedReferences[index].title || "", };
                        setReferences(updatedReferences);
                    }
                })
            }
        }
    }
    return {
        references,
        addReference,
        removeReference,
        updateReference,
        updateReferencePaste,
    };
};
export default useReferences;