'use client'
import React, {useEffect, useState} from "react"
import LogOutButton from "../../components/buttons/logout_buttons";
import LogoButton from "@/components/buttons/logo_button";
import InopButton from "@/components/buttons/inop_button";
import RouteButton from "@/components/buttons/routes_button";

const Home: React.FC = () => {
    ///--------------------------------------------------------
    // Check if a playbook item is already temporary stored
    // and user was asked to signin again.
    ///--------------------------------------------------------
    const [thereIsPlaybook, setThereIsPlaybook ] = useState<boolean>(false);

    useEffect (()=>{
      const playbook_item = sessionStorage.getItem("playbook-item");
      console.log('playbok', playbook_item);
      
      if(playbook_item){  
        setThereIsPlaybook(true);
      }
    }, []);
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
        <LogoButton type="home" />
        <LogOutButton />
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-[20vh] md:pt-2 md:w-[75%] overflow-y-auto min-h-screen items-center">
         <h1 className="text-white pt-5 font-bold font-roboto text-xl">Home</h1>
         <div className="flex flex-col justify-center items-center h-[90%] w-full">
         <div className="flex flex-col w-[80%] md:w-[50%] h-[30%] bg-transparent border-slate-500 border md:mt-5 mt-2">
            <h1 className="text-white pt-6 pl-2 text-xl font-roboto">Playbook</h1>
            <p className="text-gray-500 text-xs pl-2">Your quick access to software engineer code solutions.</p>
            {thereIsPlaybook && <RouteButton type="with-item-playbook" />}
            <div className="flex flex-row self-center pt-2 gap-x-4 ">
            <RouteButton type="playbook" />
            <RouteButton type="read-playbook" />
         </div>
         </div>
         <div className="flex flex-col w-[80%] md:w-[50%] h-[30%] bg-transparent border-slate-500 border md:mt-8 mt-3 align-middle">
            <h1 className="text-white pt-6 pl-2 text-xl font-roboto">CMS</h1>
            <p className="text-gray-500 text-xs pl-2">Write an article or continue working on one.</p>
            <div className="flex flex-row self-center pt-2">
            <RouteButton type="dashboard" />
            <InopButton type="load_article" />
         </div>
         </div>
         </div>
        </main>
        </div>
        </>
    )

}

export default Home;