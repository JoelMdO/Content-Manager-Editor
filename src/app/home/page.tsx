'use client'
import React from "react"
import LogOutButton from "../../components/buttons/logout_buttons";
import LogoButton from "@/components/buttons/logo_button";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
    //
    const url = process.env.NEXT_PUBLIC_url_api;
    const router = useRouter();
    //
    return (  
        <>
        <div className="flex flex-col md:flex-row h-screen bg-black">
      {/* Left Menu on Tablet / Desktop*/}
      <aside className="hidden w-[25%] h-full bg-gray-800 bg-opacity-50 text-white md:flex items-center flex-col">
        <LogoButton type="home" />
        <LogOutButton />
      </aside>
      {/* Menu Mobile*/}
      <nav className="md:hidden w-full h-20vh bg-gray-800 text-white flex justify-around p-2 flex-row fixed">
        <LogOutButton />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-[20vh] md:pt-2 md:w-[75%] overflow-y-auto min-h-screen items-center">
         <h1 className="text-white pt-5 font-bold font-roboto text-xl">Home</h1>
         <div className="flex flex-col justify-center items-center h-[90%] w-full">
         <div className="flex flex-col w-[50%] h-[30%] bg-transparent border-slate-500 border mt-5">
            <h1 className="text-white pt-6 pl-2 text-xl font-roboto">Playbook</h1>
            <p className="text-gray-500 text-xs pl-2">Your quick access to software engineer code solutions.</p>
            <div className="flex flex-row self-center pt-2">
            <button className="bg-gray-500 text-white py-3 px-4 rounded mt-2" type= "button" onClick={()=> router.push(`${url}/playbook`)}>Create New</button>
            <button className="bg-gray-500 ml-4 text-white py-2 px-4 rounded mt-2" type= "button" onClick={()=> router.push(`${url}/read-playbook`)}>Read Playbook</button>
         </div>
         </div>
         <div className="flex flex-col w-[50%] h-[30%] bg-transparent border-slate-500 border mt-8 align-middle">
            <h1 className="text-white pt-6 pl-2 text-xl font-roboto">CMS</h1>
            <p className="text-gray-500 text-xs pl-2">Write an article or continue working on one.</p>
            <div className="flex flex-row self-center pt-2">
            <button className="bg-gray-500 text-white py-3 px-4 rounded mt-2" type= "button" onClick={()=> router.push(`${url}/dashboard`)}>New Article</button>
            <button className="bg-gray-800 ml-4 text-white py-3 px-4 rounded mt-2 pointer-events-none" type="button">
            <span className="ml-8 absolute text-xs font-bold text-black bg-yellow px-6 py-1 rotate-45 pointer-events-none">INOP</span>Load Article</button>
         </div>
         </div>
         </div>
        </main>
        </div>
        </>
    )

}

export default Home;