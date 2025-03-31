import React from "react";
import Image from "next/image";
import emailMe from "../../utils/buttons/email_me";

//
const LogoButton: React.FC<any> = () => {
    //
    ///========================================================
    // Logo button to allow the user to contact me
    ///========================================================
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