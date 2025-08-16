"use client";
import React, { useEffect, useState } from "react";
import { Search, Tag, Clock, Link } from "lucide-react";
import BackPageButton from "../../components/buttons/back_page_button";
import LogOutButton from "../../components/buttons/logout_buttons";
import LogoButton from "../../components/buttons/logo_button";
import categories from "../../constants/categories";
// import playbookCustomButton from "../../components/buttons/playbook_custom_button/button_dashboard";
import callHub from "../../services/api/call_hub";
import dynamic from "next/dynamic";
import errorAlert from "../../components/alerts/error";
import { useRouter } from "next/navigation";
import handleInputChange from "../../components/playbook/utils/readPlaybook/handle_input_change";
import handleSelectChange from "../../components/playbook/utils/readPlaybook/handle_select_change";
import text from "../../constants/readPlaybook_data_text.json";
import withSessionProvider from "../../utils/withSessionProvider";
import { PlaybookMeta } from "../../components/playbook/types/plabookMeta";
import "../../components/playbook/styles/playbook.css";
import PlaybookCustomButton from "../../components/playbook/playbook_custom_button/button_dashboard";
import index from "swr";

//
const PlaybookForm = dynamic(
  () => import("../../components/playbook/playbook_form"),
  { ssr: false }
);
//

const ReadPlaybookPage: React.FC = () => {
  interface UpdateNoteState {
    isUpdateNote: boolean;
    noteId: string | null;
  }
  const [entries, setEntries] = useState<PlaybookMeta[] | undefined>([]); // for title, id, category and tags.
  const [isViewDetails, setViewDetails] = useState<boolean>(false);
  const [isUpdateNote, setUpdateNote] = useState<UpdateNoteState>({
    isUpdateNote: false,
    noteId: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isZeroSearchData, setZeroSearchData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEntryLoading, setEntryLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    ///--------------------------------------------------------
    // Fetch Titles, category and tags when the page loads.
    ///--------------------------------------------------------

    const fetchData = async () => {
      setIsLoading(true);
      const response = await callHub("playbook-search");

      setIsLoading(false);
      if (response.status === 200) {
        const meta = Array.isArray(response.body)
          ? response.body.map((entry: PlaybookMeta) => ({
              ...entry,
              // Add `loading` property to each entry so when button view is clicked
              // one small loader will be shown.
              loading: false,
            }))
          : [];
        setEntries(meta);
      } else if (response.status === 401) {
        errorAlert("", "playbook", response.message, router);
      }
    };

    fetchData();
  }, [router]);

  /// To filter the entries, which received the first load of data from db once the page is loaded
  /// and also when the user user searchs by search bar, it converts the searchTerm (user value to search)
  /// and in lowercase matches the title or tags and shows the cards.
  const filteredEntries = entries!.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  //

  //

  //
  let isMetaToUpdate: PlaybookMeta | undefined;
  useEffect(() => {
    const entry = entries!.find((e) => e.id === isUpdateNote.noteId);

    if (entry) {
      setEntryLoading(true);
      isMetaToUpdate = {
        id: entry.id,
        title: entry.title,
        category: entry.category,
        tags: entry.tags,
        lastUpdated: entry.lastUpdated,
        notes: entry.notes || "",
        steps: entry.steps || [],
        codeSnippets: entry.codeSnippets || [{ code: "", language: "" }],
        references: entry.references || [{ title: "", link: "" }],
      };
    }
  }, [isUpdateNote.isUpdateNote]);

  //
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-blue diamond-hesitate">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <BackPageButton />
            <h1 className="font-bold md:text-2xl text-sm">
              {text.readPlaybook.h1}
            </h1>
          </div>
          <div className="flex gap-2 items-center  mr-1">
            <PlaybookCustomButton
              type="new"
              onClick={() => {
                setIsCreating(!isCreating);
              }}
              isCreating={isCreating}
            />
            <LogOutButton type="playbook" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-screen-xl mx-auto flex-grow h-0 overflow-y-auto p-4">
        {/* Search and filters */}
        {!isCreating && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search entries by title, tags or content..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-cy="search-read-playbook"
                  value={searchTerm}
                  onChange={(e) => {
                    handleInputChange(
                      e.target.value,
                      setSearchTerm,
                      setEntries,
                      setZeroSearchData,
                      entries!
                    );
                  }}
                  onPaste={async (e) => {
                    const pastedText = e.clipboardData.getData("text");
                    const response = await callHub(
                      "playbook-search-bar",
                      pastedText
                    );
                    if (response.status === 200) {
                      setEntries(
                        Array.isArray(response.message)
                          ? (response.message as PlaybookMeta[])
                          : []
                      );
                    } else {
                    }
                  }}
                />
              </div>

              <div className="flex-shrink-0">
                <label htmlFor="category-select" className="sr-only">
                  {text.readPlaybook.label}
                </label>
                <select
                  id="category-select"
                  className="w-full md:w-48 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleSelectChange(
                      e.target.value,
                      setEntries,
                      setZeroSearchData
                    );
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Create New Entry Form */}
        {isCreating ? (
          <PlaybookForm
            type="new-playbook-at-readplaybook"
            setIsCreating={setIsCreating}
          />
        ) : isUpdateNote.isUpdateNote ? (
          <PlaybookForm
            type="updatePlaybook"
            meta={isMetaToUpdate}
            setUpdateNote={setUpdateNote}
          />
        ) : isZeroSearchData ? (
          <span className="flex text-xs bg-blue-light text-white px-2 py-1 rounded-full h-auto w-full justify-center">
            {text.readPlaybook.noZeroSearchData_span}
          </span>
        ) : isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filteredEntries.map((entry: PlaybookMeta) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md overflow-hidden shadow-black"
                data-cy="filtered-div"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-blue-700 mb-1">
                      {entry.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {entry.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3">
                    <span className="text-sm text-gray-600">{entry.notes}</span>
                  </div>

                  <div className="text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {text.readPlaybook.divClock} {entry.lastUpdated}
                    </div>
                  </div>

                  {/*isViewLoading to show a loader meanwhile the snippets and references are loaded 
                  after button view pressed*/}
                  {isEntryLoading! ? (
                    <div className="flex justify-center items-center min-h-[30%]">
                      <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    isViewDetails &&
                    entry.steps != undefined && (
                      <div className="mb-4" data-cy="viewDetails-Steps-div">
                        <h4 className="font-medium text-sm mb-2">
                          {text.readPlaybook.divSteps}
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          {entry.steps!.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}

                  {isViewDetails && entry.references != undefined && (
                    <div className="mb-4" data-cy="viewDetails-References-div">
                      <h4 className="font-medium text-sm mb-2">
                        {text.readPlaybook.divReferences}
                      </h4>
                      <ul className="list-none pl-0 text-sm">
                        {entry.references!.map((ref, i) => (
                          <li key={i} className="mb-1 flex items-center">
                            <Link size={14} className="mr-1 text-blue-500" />
                            <a
                              href={ref.link}
                              className="text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {ref.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isViewDetails && entry.codeSnippets != undefined && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-sm mb-2">
                        {text.readPlaybook.divCodeSnippets}
                      </h4>
                      <ul className="list-none pl-0 text-sm">
                        {entry.codeSnippets!.map((ref, i) => (
                          <li key={i} className="mb-1 flex items-center">
                            <Link size={14} className="mr-1 text-blue-500" />
                            <textarea
                              className="text-blue-500 hover:underline"
                              value={ref.code}
                              readOnly
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <PlaybookCustomButton
                      type="view-note"
                      id={`${entry.id}`}
                      setEntries={setEntries}
                      setViewDetails={setViewDetails}
                      setUpdateNote={setUpdateNote}
                      data-cy="View Details"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 w-full flex flex-row text-center text-gray-600 text-sm items-center">
        <div className="mx-auto md:text-base text-[10px]">
          {text.readPlaybook.divFooter}
        </div>
        <LogoButton type="playbook-footer" />
      </footer>
    </div>
  );
};

export default withSessionProvider(ReadPlaybookPage);
