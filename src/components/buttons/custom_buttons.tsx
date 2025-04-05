import React, {useState} from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import successAlert from "../alerts/sucess";
import errorAlert from "../alerts/error";
import { useRouter } from "next/navigation";
import saveButtonClicked from "@/utils/buttons/save_button_clicked";
import emailMe from "@/utils/buttons/email_me";

interface ButtonProps {
    type: string;
    onClick?: () => void;
}
//
const CustomButton: React.FC<ButtonProps> = ({type, onClick}) => {
    ///========================================================
    // Custom Buttons used on dashboard page at this stage is only
    // for Post (Save the article)
    ///========================================================
    //
    // Variables.
    let text: string, color: string, hover_color: string, icon: string;
    let position: string;
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    // States
    const [isClicked, setIsClicked] = useState(false);
    const [loading, setLoading] = useState(false);
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
            <button
                className={`h-[40px] w-[9em] shadow-md shadow-black ${position} ${isClicked? "text-black":"text-white"} text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4 ${isClicked? "bg-cream" : `${color}`} hover:${hover_color}`}
                onClick={() => {
                    if (onClick) onClick(); setIsClicked(true);
                        setTimeout(() => {
                            if(type === "post"){
                            setLoading(true);
                            }
                        if(type === "post"){
                            ///For Posting the article
                            saveButtonClicked(italic, bold)
                            .then((response) => {     
                                if (response.status === 200) {
                                setLoading(false);
                                setIsClicked(false);
                                successAlert("saved");
                                //From posting the new body article to be updated on the session storage. 
                                if(response.body){
                                    let articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
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
                        }if (type === "logo"){
                            ///To connect with me on Logo click
                            emailMe();
                        } else {
                            ///No action as clear function is on dashboard/page.tsx
                        }
                        }, 1000);}}   >
                        <Image src={icon} style={{display:isClicked? "none" :"block"}} className="md:w-6 md:h-6 w-3 h-3 cursor-pointer" width={12} height={12} alt={`${text}-icon`}/>{isClicked? "Posting" : `${text}`}
            </button>
        </>
    );
}

export default CustomButton;