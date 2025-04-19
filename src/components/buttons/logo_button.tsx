import React from "react";
import Image from "next/image";
import emailMe from "../../utils/buttons/email_me";

//
interface LogoButtonProps {
    type: string;
}
//
const LogoButton: React.FC<any> = ({type}) => {
    //
    ///========================================================
    // Logo button to allow the user to contact me
    ///========================================================
    
    let image: string = "/byJoel.png";
    let widthM = 90;
    let heightM = 90;
    let widthS = 80;
    let heightS = 30;
    let pt = "pt-0";
    switch(type){
        case "home":
         image = "/JLogo.webp";
         widthM = 90;
         heightM = 120;
         widthS = 90;
         heightS = 120;
         pt = "pt-4";
        break;
        default:
         image = image;
         widthM = widthM;
         heightM = heightM;
         widthS = widthS;
         heightS = heightS;
         pt = pt;
        break;
    }
    //
    return ( 
        <>
            <div className={`relative group ${pt}`}>
            <button
                type= "button"
                className={" text-black text-[0.60rem] md:text-base font-light rounded flex items-center justify-center md:gap-2 gap-1"}
                onClick={() => {
                        setTimeout(() => {
                            emailMe();
                        }, 500);}}   >
                        <Image src={image} style={{display:"block"}} className={`md:w-[${widthM}] md:h-[${heightM}] w-[${widthS}] h-[${heightS}] cursor-pointer`} width={90} height={90} alt={"logoJoel"}/>
                        <p className="text-xs">2025</p>
            </button>
            <div className="w-[120px] absolute mb-2 origin-bottom bg-gray-800 text-white py-2 pl-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">Let's connect!</div>
            </div>
        </>
    );
}

export default LogoButton;  