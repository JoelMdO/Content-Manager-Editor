"use client";
import React, { useRef, useState, useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { useUIStore } from "@/store/useUIStore";
import { useDraftStore } from "@/store/useDraftStore";
import dynamic from "next/dynamic";
import dbSelector from "../../components/alerts/db_selector";
import DraftArticle from "../../components/dashboard/draft_article/draft_article";
import AutoSaveScreen from "../../components/loaders/auto_save";
import PreviewArticle from "@/components/dashboard/preview/preview_article";
// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Removed all useState calls for values that are now owned by
//              Zustand stores (useEditorStore, useDraftStore, useUIStore,
//              useTranslationStore). Removed MenuContext.Provider wrapper \u2014
//              all consumers now read directly from stores.
//              Kept: refs (still created here and registered into stores),
//              dbIsReady local state (trigger for the db-setup effect).
// Impact     : The page is now a thin layout component. All state migrations
//              are complete. MenuContext / ButtonProps no longer needed here.
//
// ORIGINAL imports:
// import { ButtonProps } from "../../components/dashboard/menu/button_menu/type/type_menu_button";
// import MenuContext from "../../components/dashboard/menu/button_menu/context/menu_context";
// import { ProcessedArticle } from "@/components/dashboard/preview/types/previewed_article";

const ImageInput = dynamic(
  () => import("../../components/dashboard/menu/button_menu/image_input"),
);
const LinkDialog = dynamic(
  () => import("../../components/dashboard/menu/button_menu/link_dialog"),
);
// const SummaryDialog = dynamic(
//   () => import("../../components/dashboard/menu/summary_dialog/summary_dialog"),
//   { ssr: false },
// );
const SectionSelector = dynamic(
  () => import("../../components/dashboard/menu/button_menu/sections_selector"),
);
const LogOutButton = dynamic(
  () => import("../../components/buttons/logout_buttons"),
);
const HomeButton = dynamic(
  () => import("../../components/buttons/home_button"),
);
const MenuDesktop = dynamic(
  () => import("../../components/dashboard/menu/desktop_menu"),
);
const MenuMobile = dynamic(
  () => import("../../components/dashboard/menu/mobile_menu"),
);

const DashboardEditor = dynamic(
  () => import("../../components/dashboard/dashboard_editor"),
);
//
const Dashboard: React.FC = () => {
  //
  // Refs — created here, registered into Zustand stores on mount.
  // All consumers read them via useEditorStore.getState() / useUIStore.getState().
  const savedTitleRef = useRef<string>("");
  const savedBodyRef = useRef<string>("");
  const pageRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //
  // Local state — only dbIsReady remains to trigger the db-setup useEffect.
  // All other state lives in Zustand stores.
  const [dbIsReady, setDbIsReady] = useState<boolean>(false);
  //
  // Read from stores for JSX — thin subscriptions
  const lastAutoSave = useUIStore((s) => s.lastAutoSave);
  const previewReady = useUIStore((s) => s.previewReady);
  //
  //
  ///======================================================
  // Check if screen is desktop and database selector
  ///======================================================
  useEffect(() => {
    dbSelector();
    //
    if (window.innerWidth > 768) {
      useUIStore.getState().setIsMediumScreen(true);
    }

    if (sessionStorage.getItem("db") !== null) {
      setDbIsReady(true);
    }

    // CHANGE LOG
    // Changed by : Copilot
    // Date       : 2026-03-11
    // Reason     : Register page-level refs into Zustand stores so that
    //              useDraftStore.loadDraftIntoEditor() and other imperative
    //              actions can access the DOM refs without prop-drilling.
    // Impact     : Phase 2+ imperative draft loading relies on these registrations.
    useEditorStore.getState().initRefs({
      savedTitleRef,
      savedBodyRef,
      fileInputRef,
    });
  }, []);
  //
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2026-03-11
  // Reason     : Replaced local dbNameToSearch ref + setDraftKey with
  //              Zustand store actions. The dbIsReady signal is forwarded into
  //              useDraftStore so that hooks reading dbIsReady from the store
  //              (e.g. useGetInitialArticleDraft) work without context.
  // ORIGINAL:
  // useEffect(() => {
  //   dbNameToSearch.current = sessionStorage.getItem("db") as string;
  //   setDraftKey(`draft-articleContent-${dbNameToSearch.current}`);
  // }, [dbIsReady]);
  useEffect(() => {
    if (!dbIsReady) return;
    const dbName = sessionStorage.getItem("db") as string;
    useDraftStore.getState().setDbName(dbName);
    useDraftStore.getState().setDraftKey(`draft-articleContent-${dbName}`);
    useDraftStore.getState().setDbIsReady(true);
  }, [dbIsReady]);
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2026-03-11
  // Reason     : menuContextValue removed — all consumers read directly from
  //              Zustand stores (useEditorStore, useDraftStore, useUIStore,
  //              useTranslationStore). MenuContext.Provider wrapper also removed.
  // ORIGINAL menuContextValue block omitted (see git history).
  //
  ///======================================================
  /// UI Editor with a menu with options to insert images,
  // links, and bold or italic font style, with an <aside>
  // for tablet and desktop and a <nav> for mobile
  ///======================================================
  return (
    <section
      ref={pageRef}
      className="flex flex-col md:flex-row h-screen bg-gray-100"
    >
      {/* TABLET / DESKTOP */}
      <aside className="hidden md:flex w-[25vw] h-full gap-y-2 bg-gray-800 text-white items-center flex-col">
        <DraftArticle />
        {lastAutoSave && <AutoSaveScreen lastAutoSave={lastAutoSave} />}
        <MenuDesktop />
        <div className="flex flex-row w-full justify-center items-center mt-2">
          <HomeButton />
          <LogOutButton type={"dashboard"} />
        </div>
      </aside>
      {/* MENU MOBILE */}
      <nav className="md:hidden w-full h-[12dvh] bg-gray-800">
        <div className="w-full flex flex-row justify-between mt-2 px-2">
          {/* HomeButton at the start (left) */}
          <div className="flex-shrink-0">
            <HomeButton type="mobile" />
          </div>
          <div className="flex-grow text-center flex flex-col">
            <DraftArticle />
            {lastAutoSave && <AutoSaveScreen lastAutoSave={lastAutoSave} />}
          </div>
          {/* LogOutButton at the end (right) */}
          <div className="flex-shrink-0">
            <LogOutButton />
          </div>
        </div>
        <MenuMobile />
      </nav>
      {/* Main Content */}
      <main className="flex-1 p-4 pt-2 h-[80dvh] md:h-full md:w-[75vw] overflow-y-auto">
        {previewReady ? <PreviewArticle /> : <DashboardEditor />}
        <SectionSelector />
        <ImageInput index={1} />
        <LinkDialog index={1} />
        {/* <SummaryDialog /> */}
      </main>
    </section>
  );
};

export default Dashboard;
