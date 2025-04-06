import React, {useState} from "react";
import Image from "next/image";
import callHub from "../../services/api/call_hub";
import { useRouter } from "next/navigation";
import errorAlert from "../alerts/error";

interface LogoButtonProps {
    type?: string;
}
//
const LogOutButton: React.FC<LogoButtonProps> = ({type}) => {
    ///========================================================
    // To log out the user.
    ///========================================================
    //
        let widthSet = 80;
        let heightSet = 80;
        let mt = "md:mt-auto";
        let mb = "md:mb-14";
    switch(type){

        case "playbook":
            widthSet = 50;
            heightSet = 60;
            mt = "md:mt-0";
            mb = "md:mb-0";
            break;
        default:
            widthSet = widthSet;
            heightSet = heightSet;
            mt = mt;
            mb = mb;
            break;
    };
    // States
    const [isClicked, setIsClicked] = useState(false);
    const icon="/door_exit.png";
    const icon_mobile = "/window_exit.png";
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    //
    const handleLogout = async () => {
    const response =  await callHub('logout');
    /// Remove sessionStorage.
    sessionStorage.removeItem("tempTitle");
    sessionStorage.removeItem("tempBody");
    if (response.status == 200){
        router.push(`${url}/`);
    } else {
        errorAlert("Logout", "logout", response.message);
    }}
    //
    ///--------------------------------------------------------
    // UI logout button
    ///--------------------------------------------------------
    //
    return ( 
        <>  <button
            type= "button"
            className = {`${mt} ${mb}`}
            onClick={() => {handleLogout(); setIsClicked(true);}}>
            {/* Mobile Icon */}
                <Image src={icon_mobile} className="block md:hidden cursor-pointer" width={50} height={60} alt="logout-button"/>
            {/* Desktop Icon */}
                <Image src={icon} className="hidden md:block cursor-pointer" width={widthSet} height={heightSet} alt="logout-button"/>
        </button>
        {type == "playbook" ? null : (
        <>
        <span className="hidden md:inline">{isClicked ? "Bye!" : "Logout"}</span>
        <span className="md:hidden">{isClicked ? "Bye!" : ""}</span>
        </>
        )}
        </>
    );
}

export default LogOutButton;