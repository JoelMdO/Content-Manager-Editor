'use client'
import React, { useEffect, useState } from 'react';
import { Search, Tag, Clock, Link } from 'lucide-react';
import BackPageButton from '../../components/buttons/back_page_button';
import LogOutButton from '../../components/buttons/logout_buttons';
import LogoButton from '../../components/buttons/logo_button';
import categories from '../../utils/categories';
import CustomButton from '../../components/buttons/custom_buttons';
import callHub from '@/services/api/call_hub';
import dynamic from 'next/dynamic';
import errorAlert from '@/components/alerts/error';
import debouncedSearch from '@/utils/playbook/debounce_search';
import { useRouter } from 'next/navigation';
import {getDocsFromCache, collection} from 'firebase/firestore';
//
const  PlaybookForm = dynamic(() => import('../../components/playbook/playbook_form'), { ssr: false });
//

const ReadPlaybookPage: React.FC = ()=>{
  interface Entry {
    id: string;
    title: string;
    category: string;
    tags: string[];
    lastUpdated: string;
    notes?: string;
    steps?: [];
    codeSnippets?: [{ code: string; language: string }];
    references?: [{title: string, link: string}];
  }
  interface UpdateNoteState {
      isUpdateNote: boolean;
      noteId: string | null;
  }
  const [entries, setEntries] = useState<Entry[]>([]); // for title, id, category and tags.
  const [isViewDetails, setViewDetails] = useState<boolean>(false); 
  const [isUpdateNote, setUpdateNote] = useState<UpdateNoteState>({ isUpdateNote: false, noteId: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const [isZeroSearchData, setZeroSearchData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
      ///--------------------------------------------------------
      // Fetch Titles, category and tags when the page loads.
      ///--------------------------------------------------------
      console.log('doing use effect');
      
      const fetchData = async () => {
      setIsLoading(true);
      const response = await callHub("playbook-search");
      console.log('response', response);
      setIsLoading(false);
      if(response.status === 200){
      const meta = response.body;
      console.log('meta', meta);
          setEntries(meta);
      } else if (response.status === 401){
        errorAlert("", "playbook", response.message, router);
      }};

      fetchData();
  }, []);

  /// To filter the entries, which received the first load of data from db once the page is loaded
  /// and also when the user user searchs by search bar, it converts the searchTerm (user value to search)
  /// and in lowercase matches the title or tags and shows the cards.
     const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;
        console.log(entry.title, { matchesSearch, matchesCategory });
        return matchesSearch && matchesCategory;
      });
  //

  async function handleInputChange(selectValue: string) {
    //TODO separate to another file.
    console.log("searching", selectValue);
    setSearchTerm(selectValue);
    debouncedSearch(selectValue, setEntries, setZeroSearchData, entries);
  }
  //
  async function handleSelectChange(selectedValue: string) {
    //TODO separate to another file.
    console.log("searching", selectedValue);
    const response = await callHub("playbook-search-category", selectedValue);
    if (response.status === 200) {
      console.log('response.bd at debounce', response.body);
      
      setEntries(response.body);
      setZeroSearchData(false);
    } else {
      if (entries.length <= 0) {
        setZeroSearchData(true);
      }
      console.log("Error fetching entries:", response.message);
    }
  }
  //
  let isMetaToUpdate;  
  if(isUpdateNote.isUpdateNote){
      console.log('doing entry for setMeta after isUpdateNote is true');
      
    const entry = entries.find(e => e.id === isUpdateNote.noteId);
    if (entry) {
    isMetaToUpdate = {
        id: entry.id,
        title: entry.title,
        category: entry.category,
        tags: entry.tags,
        lastUpdated: entry.lastUpdated,
        steps: entry.steps || [],
        codeSnippets: entry.codeSnippets || [{ code: "", language: "" }],
        references: entry.references || [{title: "", link: ""}],
        notes: entry.notes || '',
      };
    }
    console.log('entry on isUpdateNote', entry);
  };
  //
  console.log({
    isCreating,
    isUpdateNote: isUpdateNote.isUpdateNote,
    isZeroSearchData,
    isLoading,
    filteredEntriesLength: filteredEntries.length,
  });
  //
  return (
    <div className="flex flex-col min-h-screen bg-blue">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4 items-center">
          <BackPageButton />
          <h1 className="text-2xl font-bold">Developer Playbook</h1>  
          </div>
          <div className='flex gap-2 align-middle  mr-1'>
          <CustomButton type="new" onClick={() => {setIsCreating(!isCreating)}} isCreating={isCreating}/>
          <LogOutButton type="playbook"/>
          <LogoButton type="playbook" />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">
        {/* Search and filters */}
        {!isCreating && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search entries by title, tags or content..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    console.log('searching', e.target.value);
                    handleInputChange(e.target.value);

                  }}
                  onPaste={async (e) => {
                    const pastedText = e.clipboardData.getData("text");
                    console.log("Pasted:", pastedText);
                    const response = await callHub("playbook-search-bar", pastedText);
                    if (response.status === 200) {
                      setEntries(response.message);
                    } else {
                      console.error('Error fetching entries:', response.message);
                    }
                  }}
                />
                </div>
              
              <div className="flex-shrink-0">
                <label htmlFor="category-select" className="sr-only">Select Category</label>
                <select
                  id="category-select"
                  className="w-full md:w-48 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleSelectChange(e.target.value);
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Create New Entry Form */}
        {isCreating ? (
          <PlaybookForm type ="new-playbook" setIsCreating={setIsCreating}/>
        ) : isUpdateNote.isUpdateNote? <PlaybookForm type="updatePlaybook" meta={isMetaToUpdate} setUpdateNote={setUpdateNote}/> 
        : isZeroSearchData ? <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">No data found</span> 
        : isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filteredEntries.map((entry: Entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden shadow-black">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-blue-700 mb-1">{entry.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{entry.category}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      Last updated: {entry.lastUpdated}
                    </div>
                  </div>

                  {isViewDetails && entry.steps != undefined && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Steps:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {entry.steps!.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>)}
                  
                  {isViewDetails && entry.references != undefined && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">References:</h4>
                      <ul className="list-none pl-0 text-sm">
                        {entry.references!.map((ref, i) => (
                          <li key={i} className="mb-1 flex items-center">
                            <Link size={14} className="mr-1 text-blue-500" />
                            <a href={ref.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                              {ref.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <CustomButton type="view-note" id={`${entry.id}`} setEntries={setEntries} setViewDetails={setViewDetails} setUpdateNote={setUpdateNote}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto">
          Developer Playbook - Your coding solutions library, by Joel Montes de Oca Lopez 2025
        </div>
      </footer>
    </div>
  );
}

export default ReadPlaybookPage;