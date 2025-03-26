import React from "react";
import Image from "next/image";
import emailMe from "@/utils/buttons/email_me";

//
const LogoButton: React.FC<any> = () => {
    //
    // Function to handle button click and add a new textarea/
    //
    return ( 
        <>
            <div className="relative group">
            <button
                className={"h-[40px] w-[12em] text-black text-[0.60rem] md:text-base font-light rounded flex items-center justify-center md:gap-2 gap-1 mt-4"}
                onClick={() => {
                    console.log('button Logo clicked');
                        setTimeout(() => {
                            emailMe();
                        }, 500);}}   >
                        <Image src={"/JLogo.webp"} style={{display:"block"}} className="md:w-6 md:h-6 w-3 h-3 cursor-pointer" width={1200} height={400} alt={"logoJoel"}/>
                        <p className="">By JoelML 2025</p>
            </button>
            <div className="w-[120px] absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 pl-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">Let's connect!</div>
            </div>
        </>
    );
}

export default LogoButton;  