import React from "react";
import Image from "next/image";
import emailMe from "../../utils/buttons/email_me";

//
interface LogoButtonProps {
    type: string;
}
//
interface LogoButtonProps {
    type: string;
}
//
const LogoButton: React.FC<any> = () => {
    //
    ///========================================================
    // Logo button to allow the user to contact me
    ///========================================================
    
    let image: string = "/byJoel.png";
    let widthM = 90;
    let heightM = 90;
    let widthDefault = 90;
    let heightDefault = 90;
    let widthS = 80;
    let heightS = 30;
    let mtM = "md:mt-0";
    let mtS = "mt-0";
    let mbS = "mb-0";
    let textColor = "text-white";
    //
    switch(type){
        case "home":
         image = "/JLogo.webp";
         widthM = 90;
         heightM = 120;
         widthS  = widthDefault = 65;
         heightS = heightDefault = 95;
         mtM = "md:mt-4";
         mtS = "mt-0";
         mbS = "mb-2";
        break;
        case "playbook":
         image = "/JLogo.webp";
         widthM = 90;
         heightM = 120;
         widthS  = widthDefault = 50;
         heightS = heightDefault = 80;
         mtM = mtM;
         mtS = mtS;
        break;
        default:
         image = image;
         widthM = widthM;
         heightM = heightM;
         widthS = widthS;
         heightS = heightS;
         mtM = mtM;
         mtS = mtS;
         textColor = "text-black";
        break;
    }
    //
    return ( 
        <>
            <div className="relative group">
            <button
                className={"h-[40px] text-black text-[0.60rem] md:text-base font-light rounded flex items-center justify-center md:gap-2 gap-1 mt-4"}
                onClick={() => {
                        setTimeout(() => {
                            emailMe();
                        }, 500);}}   >
                        <Image src={"/byJoel.png"} style={{display:"block"}} className="md:w-[160px] md:h-[70px] w-[80px] h-[40px] cursor-pointer" width={90} height={90} alt={"logoJoel"}/>
                        <p className="text-xs">2025</p>
            </button>
            <div className="w-[120px] absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 pl-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">Let's connect!</div>
            </div>
        </>
    );
}

export default LogoButton;  