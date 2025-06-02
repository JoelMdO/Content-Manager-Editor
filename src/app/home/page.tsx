"use client";
import React, { useEffect, useState } from "react";
import LogOutButton from "../../components/buttons/logout_buttons";
import LogoButton from "@/components/buttons/logo_button";
import InopButton from "@/components/buttons/inop_button";
import RouteButton from "@/components/buttons/routes_button";
import text from "../../constants/homePage_data_text.json";

const Home: React.FC = () => {
  const [thereIsPlaybook, setThereIsPlaybook] = useState<boolean>(false);
  ///--------------------------------------------------------
  // Check if a playbook item is already temporary stored
  // and user was asked to signin again.
  ///--------------------------------------------------------
  useEffect(() => {
    const playbook_item = sessionStorage.getItem("playbook-item");

    if (playbook_item) {
      setThereIsPlaybook(true);
    }
  }, []);
  //
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-black">
        {/* Left Menu on Tablet / Desktop*/}
        <aside className="hidden w-[25%] h-full bg-gray-800 bg-opacity-50 text-white md:flex items-center flex-col">
          <LogoButton type="home-web" />
          <LogOutButton />
        </aside>
        {/* Menu Mobile*/}
        <nav className="md:hidden w-full h-[10dvh] bg-gray-800 text-white flex justify-around p-2 flex-row fixed items-center align-middle">
          <LogoButton type="home-mobile" />
          <LogOutButton />
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 pt-[10vh] md:pt-0 md:w-[75%] overflow-y-auto min-h-screen items-center bg-black">
          <h1 className="text-white pt-5 font-bold font-roboto text-xl">
            {text.homePage.home}
          </h1>
          <div className="flex flex-col justify-center items-center h-[90%] w-full">
            <div className="flex flex-col w-[90%] md:w-[50%] md:h-[30%] h-[35%] bg-transparent border-slate-500 border md:mt-5 mt-2">
              <h1 className="text-white pt-6 pl-2 text-xl font-roboto">
                {text.homePage.playbook}
              </h1>
              <p className="text-gray-500 text-xs pl-2">
                {text.homePage.slogan}
              </p>
              {thereIsPlaybook && <RouteButton type="with-item-playbook" />}
              <div className="flex flex-row self-center pt-2 gap-x-4 ">
                <RouteButton type="playbook" data-cy="route-button-playbook" />
                <RouteButton
                  type="read-playbook"
                  data-cy="route-button-read-playbook"
                />
              </div>
            </div>
            <div className="flex flex-col w-[90%] md:w-[50%] md:h-[30%] h-[35%] bg-transparent border-slate-500 border md:mt-8 mt-3 align-middle">
              <h1 className="text-white pt-6 pl-2 text-xl font-roboto">
                {text.homePage.CMS}
              </h1>
              <p className="text-gray-500 text-xs pl-2">
                {text.homePage.cmsSlogan}
              </p>
              <div className="flex flex-row self-center pt-2">
                <RouteButton
                  type="dashboard"
                  data-cy="route-button-dashboard"
                />
                <InopButton type="load_article" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
