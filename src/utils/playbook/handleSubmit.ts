import errorAlert from "@/components/alerts/error";
import successAlert from "@/components/alerts/sucess";
import callHub from "@/services/api/call_hub";


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,
    setIsSaving: (isSaving: boolean) => void,
    setSaveSuccess: (success: boolean) => void,
    title: string,
    category: string,
    tags: string[],
    steps: string[],
    notes: string,
    codeSnippets: any[],
    references: any[],
    resetForm: () => void,
    router?: any
) => {
    e.preventDefault();
    setIsSaving(true);
    //
    const lastUpdate = new Date();
    const dateFormatted = lastUpdate.toLocaleString('es-ES', {
      timeZone: 'Europe/Moscow', // UTC+3
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });

    const data = {
      title,
      category,
      tags,
      steps,
      notes,
      codeSnippets,
      references,
      lastUpdated: dateFormatted
    };
    //
    const response = await callHub("playbook-save", data);
    //
     if(response.status === 200){
      setIsSaving(false);
      setSaveSuccess(true);
      successAlert("playbook", undefined, resetForm, router);
      // Reset success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
     } else {
      setIsSaving(false);
      if(response.message === "Reauthentication failed"){
        const dataString = JSON.stringify(data);
        console.log('data', data);
        console.log('dataString', dataString);
        sessionStorage.setItem("playbook-item", dataString);
        errorAlert("Saving data Playbook", "playbook", "Reauthentication failed", router);
      } else {
        errorAlert("Saving data Playbook", "non200", response.message);
      }
     }
};

  export default handleSubmit;