import React, {useState} from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import successAlert from "../alerts/sucess";
import errorAlert from "../alerts/error";
import { useRouter } from "next/navigation";
import saveButtonClicked from "../../utils/buttons/save_button_clicked";
import emailMe from "@/utils/buttons/email_me";
import Link from "next/link";
import handleNoteClick from "../../utils/playbook/handle_note_click";
import { log } from "node:console";
import { set } from "lodash";

interface ButtonProps {
    type: string;
    onClick?: () => void;
    isCreating?: boolean;
    id?: string;
    setViewDetails?: React.Dispatch<React.SetStateAction<boolean>>;
    setEntries?: React.Dispatch<React.SetStateAction<any[]>>;
    setUpdateNote?: React.Dispatch<React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>>;
    setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
    'data-cy'?: string;
    resetForm?: () => void;
}
//
const CustomButton: React.FC<ButtonProps> = ({type, onClick, isCreating, id, setViewDetails, setEntries, setUpdateNote, setIsCreating, 'data-cy': dataCity, resetForm}) => {
    ///========================================================
    // Custom Buttons used on dashboard page at this stage is only
    // for Post (Save the article)
    ///========================================================
    //
    // Variables.
    let text: string, color: string, hover_color: string, icon: string, width: string = "w-[9em]", textColor: string = "text-white", otherFeatures: string = "font-bold mt-4";
    let textSmallSize: string = "text-[0.60rem]", shadow: string = "shadow-md shadow-black", height: string = "h-[40px]";
    let position: string;
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    // States
    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [noteViewMode, setNoteViewMode] = useState<"view" | "edit">("view");
    
    let isNew: boolean = false, isLink: boolean = false;
    // Retrieve text styles from Redux for saving on saveButtonClicked
    const italic = useSelector((state: any) => state.data_state?.fontStyle);
    const bold = useSelector((state: any) => state.data_state?.fontWeight);
    //
    
    //
    switch (type) {
        case "post":
            text = "Post";
            color = "bg-green";
            hover_color= "bg-green-light";
            icon='/inbox.png';
            position='';
            textColor = isClicked? "text-black" : textColor; 
        break;
        case "new":
            isNew = true;
            text = isCreating ? "Cancel" : "Create New Entry";
            color = "bg-blue-light";
            hover_color= "bg-green";
            icon='';
            position='';
            otherFeatures = "font-bold";
        break;
        case "view-note":
            isNew = true;
            if(noteViewMode === "view"){ text = "View Details"} else { text="Update"};
            color = "bg-gray-100";
            hover_color = "bg-gray-200";
            width = "w-full";
            textColor = "text-black";
            otherFeatures = "py-2 rounded transition mt-4 font-bold";
            icon='';
            position='';
            textSmallSize = "text-[0.80rem]";
            shadow= "shadow-sm shadow-gray-800";
        break;
        case "updatePlaybook":
            text= "Cancel";
            isNew = true;
            color = "bg-gray-300";
            hover_color = "bg-blue-light"; 
            otherFeatures ="px-6 py-3 border border-gray-300 rounded-md";
            textColor = "text-gray-700";
            icon = "";
            position = "";
            shadow="";
            height = "";
            width = "";
        break;
        case "new-playbook":
        case "new-playbook-at-readplaybook":
            text= "Cancel";
            isNew = true;
            color = "bg-gray-300";
            hover_color = "bg-blue-light"; 
            otherFeatures ="px-6 py-3 border border-gray-300 rounded-md text-bold text-base";
            textColor = "text-gray-700";
            icon = "";
            position = "";
            shadow="";
            height = "";
            width = "";
        break;
        case "with-item-playbook":
            text= "Cancel";
            isNew = true;
            isLink = true;
            color = "bg-gray-300";
            hover_color = "bg-blue-light"; 
            otherFeatures ="px-6 py-3 border border-gray-300 rounded-md";
            textColor = "text-gray-700";
            icon = "";
            position = "";
            shadow="";
            height = "";
            width = "";
        break;
        default:
            text = "Clear";
            hover_color= "bg-green";
            color = "bg-blue";
            icon='/clear.png';
            position='';
        break;
        
    }
    //
    // Function to handle button click and add a new textarea/
    //
    return ( 
        <>
            {isLink?   <Link href="/playbook"/> :
            <button
                type = "button"       
                data-cy={dataCity}         
                className={`${height} ${width} ${textColor} ${otherFeatures} ${shadow} ${position} ${isClicked? "text-black":{textColor}} ${textSmallSize} md:text-lg rounded text-center flex items-center justify-center md:gap-2 gap-1  ${isClicked? "bg-cream" : `${color}`} hover:${hover_color}`}
                onClick={() => {
                    if (onClick) onClick(); 
                        setTimeout(() => {
                        if(type === "post"){
                            ///For Posting the article
                            setIsClicked(true);
                            setLoading(true);
                            saveButtonClicked(italic, bold)
                            .then((response) => {     
                                if (response.status === 200) {
                                setLoading(false);
                                setIsClicked(false);
                                successAlert("saved");
                                //From posting the new body article to be updated on the session storage. 
                                if(response.body){
                                    const dbName = sessionStorage.getItem("db");
                                    let articleContent = JSON.parse(sessionStorage.getItem(`articleContent-${dbName}`) || "[]");
                                    articleContent.push({ type: "body", content: response.body});
                                }
                                } else if (response.message === "User not authenticated" || response.status === 401) {
                                    setLoading(false);
                                    setIsClicked(false);
                                    errorAlert("saved", "nonauth", response.message);
                                    //Redirect the user to login page
                                        router.push(`${url}/`);
                                } else {
                                    setLoading(false);
                                    setIsClicked(false);    
                                 errorAlert("saved", "non200", response.message);
                                }
                            }).catch((error) => {
                                errorAlert("saved", "error", error);
                            })
                        } else if (type === "logo"){
                            ///To connect with me on Logo click
                            emailMe();
                        } else if (type === "view-note"){
                            setNoteViewMode((prev) => (prev === "view" ? "edit" : "view"));
                            if (noteViewMode === "view") {
                                //Set the card loading to true to show the loader.
                                setEntries!((prevEntries) =>
                                    prevEntries.map((entry) =>
                                      entry.id === id ? { ...entry, loading: true } : entry
                                    )
                                  );

                                handleNoteClick(id!).then((meta) => {
                                //Set the card loading to false to hide the loader.
                                    setViewDetails!(true);
                                    setEntries!((prevEntries) =>
                                    prevEntries.map((entry) =>
                                        entry.id === id ? { ...entry, loading: false } : entry
                                    )
                                    );
                                // Show the data if response is not null.    
                                if (meta) {
                                  setEntries!((prev) =>
                                    prev.map((entry) => (entry.id === id ? meta : entry))
                                  );
                                }
                              });
                            }else {
                                //Send the update to allow update the playbook note.
                                setUpdateNote!({isUpdateNote: true, noteId: id!});
                            }
                        } else if (type === "updatePlaybook"){
                            setUpdateNote!({isUpdateNote: false, noteId: ""});
                        } else if (type === "new-playbook") {
                         
                           resetForm!();
                           router.push('/home');
                        } else if (type === "new-playbook-at-readplaybook"){
                            setIsCreating!(false);
                        } else {
                            ///No action as clear function is on dashboard/page.tsx
                        }
                        }, 1000);}}   >
                        {isNew? null : 
                        <Image src={icon} style={{display:isClicked? "none" :"block"}} className={`md:w-6 md:h-6 w-3 h-3 cursor-pointer ${textColor}`}width={12} height={12} alt={`${text}-icon`}/>}{isClicked? "Posting" : `${text}`}
            </button>}
        </>
    );
}

export default CustomButton;