import React, {useState} from "react";
import Image from "next/image";
import callHub from "../../services/api/call_hub";
import { useRouter } from "next/navigation";
import errorAlert from "../alerts/error";

//
const LogOutButton: React.FC<any> = () => {
    //
    // States
    const [isClicked, setIsClicked] = useState(false);
    const icon="/door_exit.png";
    const icon_mobile = "/window_exit.png";
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    //
    const handleLogout = async () => {
    const sessionId = sessionStorage.getItem('sessionId');
    console.log("sessionId at handleLogout", sessionId);
    const response =  await callHub('logout', sessionId);
    sessionStorage.removeItem('sessionId');
    if (response.status == 200){
        console.log("should redirect")
        router.push(`${url}/`);
    } else {
        errorAlert("Logout", "logout", response.message);
    }}
    //
    //
    return ( 
        <>  <button
            className = "md:mt-auto md:mb-14"
            onClick={() => {handleLogout(); setIsClicked(true);}}>
            {/* Mobile Icon */}
                <Image src={icon_mobile} className="block md:hidden cursor-pointer" width={50} height={60} alt="logout-button"/>
            {/* Desktop Icon */}
                <Image src={icon} className="hidden md:block cursor-pointer" width={70} height={80} alt="logout-button"/>
        </button>
        <span className="hidden md:inline">{isClicked ? "Bye!" : "Logout"}</span>
        <span className="md:hidden">{isClicked ? "Bye!" : ""}</span>
        </>
    );
}

export default LogOutButton;