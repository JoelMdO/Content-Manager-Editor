import React, {useState} from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import callHub from "@/services/call_hub";
import successAlert from "./alerts/sucess";
import errorAlert from "./alerts/error";
import { useRouter } from "next/navigation";

interface ButtonProps {
    type: string;
    onClick?: () => void;
}
//
const CustomButton: React.FC<ButtonProps> = ({type, onClick}) => {
    //
    // Ensure safe access to editorRefs
    // variables.
    let text: string, color: string, hover_color: string, icon: string;
    let position: string;
    let articleContent: any[] = [];
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    // States
    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    // retrieve Image from Redux
    const italic = useSelector((state: any) => state.data_state?.fontStyle);
    const bold = useSelector((state: any) => state.data_state?.fontWeight);
    console.log('italic', italic);
    console.log('bold', bold);

    //
    console.log(`Button ${type}`);
    //
    const saveButtonClicked = async () => {
        console.log('saveButtonClicked', saveButtonClicked);
        console.log('italic on click', italic);
        console.log('bold on click', bold);
        articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
        articleContent.push(
            {type: "italic", content: italic},
            {type: "bold", content: bold});
        const response = await callHub("post", articleContent);
        console.log('response at saveButtonClicked after callHub', response);
        console.log('response status', response.status);
            return response;
        //}
    };
    //
    //
    switch (type) {
        case "post":
        text = "Post";
        color = "bg-green";
        hover_color= "bg-green-light";
        icon='/inbox.png';
        position='';
        break;  
        default:
        text = "";
        hover_color= "";
        color = "";
        icon='';
        position='';
        break;
        
    }
    //
    // Function to handle button click and add a new textarea/
    //
    return ( 
        <>
            <button
                className={`h-[40px] w-[9em] shadow-md shadow-black ${position} ${isClicked? "text-black":"text-white"} text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4 ${isClicked? "bg-cream" : `${color}`} hover:${hover_color}`}
                onClick={() => {
                    console.log('button post clicked');
                    if (onClick) onClick(); setIsClicked(true);
                        setTimeout(() => {
                            setIsClicked(false);
                            setLoading(true);
                            saveButtonClicked()
                            .then((response) => {
                                setLoading(false);
                                console.log('Response status:', response.status);
                                console.log('Response message:', response.message);
                                console.log("url", url);                                
                                if (response.status === 200) {
                                successAlert("saved");
                                } else if (response.message === "User not authenticated"){
                                    errorAlert("saved", "nonauth", response.message);
                                    //Redirect the user to login page
                                    console.log('redirecting to login page');
                                        router.push(`${url}/`);
                                } else {
                                    console.log('at else');
                                errorAlert("saved", "non200", response.message);
                                }
                            }).catch((error) => {
                                errorAlert("saved", "error", error);
                            })
                        }, 1000);}}   >
                        <Image src={icon} style={{display:isClicked? "none" :"block"}} className="md:w-6 md:h-6 w-3 h-3 cursor-pointer" width={12} height={12} alt={`${text}-icon`}/>{isClicked? "Posting" : `${text}`}
            </button>
        </>
    );
}

export default CustomButton;