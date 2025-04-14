'use client';
import React from 'react';
import dynamic from "next/dynamic";
//
const LogOutButton = dynamic(() => import('../../components/buttons/logout_buttons'), { ssr: false });
const LogoButton = dynamic(() => import('../../components/buttons/logo_button'), { ssr: false });
const BackPageButton = dynamic(() => import('../../components/buttons/back_page_button'), { ssr: false });
const PlaybookForm = dynamic(()=> import('../../components/playbook/playbook_form'), {ssr: false})
//
const Playbook: React.FC = () => {
  //
  return (
    <div className="min-h-screen bg-blue pb-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50  bg-blue-600 text-white h-[85px] shadow-md flex flex-row justify-between items-center w-full backdrop-blur-md">
        <div className="flex gap-2">
          <BackPageButton/>
        </div>  
          <div className='flex gap-2 align-items-center mr-2'>
          <LogOutButton type="playbook"/>
          <LogoButton type="playbook" />
        </div>
      </header>
      
      {/* Main Form */}
      <main className="pt-28 container mx-auto px-4">
        <PlaybookForm data-cy="playbook-form" />
      </main>
    </div>
  );
}

export default Playbook;