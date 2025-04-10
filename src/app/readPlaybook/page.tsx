'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { Search, Tag, Clock, Link, Bookmark, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import BackPageButton from '../../components/buttons/back_page_button';
import LogOutButton from '../../components/buttons/logout_buttons';
import LogoButton from '../../components/buttons/logo_button';
import categories from '../../utils/categories';
import PlaybookForm, { PlaybookFormProps } from '../../components/playbook_form';
import CustomButton from '../../components/buttons/custom_buttons';
import callHub from '@/services/api/call_hub';
import { dbFireStore } from '../../../firebase';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { debounce } from 'lodash';
import debouncedSearch from '@/utils/playbook/debounce_search';
import { log } from 'node:console';
import { useCodeSnippets } from '@/utils/playbook/code_snippet_hook';

export default function ReadPlaybookPage() {

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
  const [metaToUpdate, setMetaToUpdate] = useState<PlaybookFormProps["meta"] | null>(null);
  // let metaToUpdate: {id: string,
  //   title: string,
  //   category: string,
  //   tags: string[],
  //   lastUpdated: string,
  //   notes: string,
  //   steps: string[],
  //   codeSnippets: [{ code: string, language: string }],
  //   references: [{title: string, link: string}]};
  // {
    //   id: 1,
    //   title: "JWT Authentication Implementation",
    //   category: "Authentication",
    //   tags: ["JWT", "Auth", "Security"],
    //   lastUpdated: "2025-04-01",
    //   steps: [
    //     "Install required packages: npm install jsonwebtoken",
    //     "Set up environment variables for JWT_SECRET",
    //     "Create auth middleware to verify tokens"
    //   ],
    //   codeSnippets: [
    //     {
    //       language: "typescript",
    //       code: "import jwt from 'jsonwebtoken';\n\nexport const generateToken = (userId: string) => {\n  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });\n};"
    //     }
    //   ],
    //   references: [
    //     { title: "JWT Documentation", url: "https://jwt.io/introduction" },
    //     { title: "Auth Best Practices", url: "https://example.com/auth-best-practices" }
    //   ],
    //   notes: "Remember to refresh tokens before expiry. Consider using httpOnly cookies for better security."
    // },
    // {
    //   id: 2,
    //   title: "React Query Cache Bug Fix",
    //   category: "Bugs",
    //   tags: ["React", "Cache", "Data Fetching"],
    //   lastUpdated: "2025-03-28",
    //   steps: [
    //     "Identify stale cache causing UI inconsistencies",
    //     "Implement proper invalidation on mutations",
    //     "Add cache time configuration"
    //   ],
    //   codeSnippets: [
    //     {
    //       language: "typescript",
    //       code: "const queryClient = useQueryClient();\n\nconst mutation = useMutation({\n  mutationFn: updateTodo,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['todos'] });\n  },\n});"
    //     }
    //   ],
    //   references: [
    //     { title: "React Query Docs", url: "https://tanstack.com/query/latest" }
    //   ],
    //   notes: "When dealing with real-time data, consider lower cache times or manual invalidation strategies."
    // }
  // ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  // const [newEntry, setNewEntry] = useState({
  //   title: "",
  //   category: "",
  //   tags: "",
  //   steps: "",
  //   codeSnippets: [{ language: "typescript", code: "" }],
  //   references: [{ title: "", url: "" }],
  //   notes: ""
  // });
  const [isCreating, setIsCreating] = useState(false);
  const [isOnEdit, onEdit] = useState<String>("");

  useEffect(() => {
      ///--------------------------------------------------------
      // Fetch Titles, category and tags when the page loads.
      ///--------------------------------------------------------
      const fetchData = async () => {
          const snap = await getDocs(collection(dbFireStore, "playbook"));
          const meta = snap.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title,
              category: doc.data().category,
              tags: doc.data().tags,
              lastUpdated: doc.data().lastUpdated.toDate().toLocaleString()
          }));
          console.log('meta',meta);
          
          setEntries(meta);
      };
  
      fetchData();
  }, []);

  useEffect(()=>{

  },[isViewDetails])

  // const categories = ["All", "Authentication", "Bugs", "API", "Performance", "Security", "DevOps"];

  // const filteredEntries = entries.filter(entry => {
  //   const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;
    
  //   return matchesSearch && matchesCategory;
  // });
  
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    console.log("searching", val);
    setSearchTerm(val);
    const response = await callHub("playbook-search", val);
    if (response.status === 200) {
      setEntries(response.message);
    } else {
      console.error("Error fetching entries:", response.message);
    }
  };

  // const handleEdit = (isOnEdit: string, setMetaToUpdate: React.Dispatch<React.SetStateAction<boolean>>, setUpdateNote: React.Dispatch<React.SetStateAction<boolean>>) => {
  let isMetaToUpdate;  
  if(isUpdateNote.isUpdateNote){
      console.log('doing entry for setMeta after isUpdateNote is true');
      
    const entry = entries.find(e => e.id === isUpdateNote.noteId);
    if (entry) {
      // setMetaToUpdate({
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

  // const handleCreateEntry = () => {
  //   const tagsArray = newEntry.tags.split(',').map(tag => tag.trim());
  //   const stepsArray = newEntry.steps.split('\n').filter(step => step.trim() !== '');
    
  //   const newEntryFormatted = {
  //     id: entries.length + 1,
  //     title: newEntry.title,
  //     category: newEntry.category,
  //     tags: tagsArray,
  //     lastUpdated: new Date().toISOString().split('T')[0],
  //     steps: stepsArray,
  //     codeSnippets: newEntry.codeSnippets,
  //     references: newEntry.references.filter(ref => ref.title && ref.url),
  //     notes: newEntry.notes
  //   };
    
  //   setEntries([...entries, newEntryFormatted]);
  //   setIsCreating(false);
  //   setNewEntry({
  //     title: "",
  //     category: "",
  //     tags: "",
  //     steps: "",
  //     codeSnippets: [{ language: "typescript", code: "" }],
  //     references: [{ title: "", url: "" }],
  //     notes: ""
  //   });
  // };

  // const handleAddCodeSnippet = () => {
  //   setNewEntry({
  //     ...newEntry,
  //     codeSnippets: [...newEntry.codeSnippets, { language: "typescript", code: "" }]
  //   });
  // };

  // const handleAddReference = () => {
  //   setNewEntry({
  //     ...newEntry,
  //     references: [...newEntry.references, { title: "", url: "" }]
  //   });
  // };

  // const updateCodeSnippet = (index: number, field: string, value: string) => {
  //   const updatedSnippets = [...newEntry.codeSnippets];
  //   updatedSnippets[index] = { ...updatedSnippets[index], [field]: value };
  //   setNewEntry({ ...newEntry, codeSnippets: updatedSnippets });
  // };

  // const updateReference = (index: number, field: string, value: string) => {
  //   const updatedReferences = [...newEntry.references];
  //   updatedReferences[index] = { ...updatedReferences[index], [field]: value };
  //   setNewEntry({ ...newEntry, references: updatedReferences });
  // };

  return (
    <div className="flex flex-col min-h-screen bg-blue">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4 items-center">
          <BackPageButton />
          <h1 className="text-2xl font-bold">Developer Playbook</h1>  
          </div>
          <div className='flex gap-2 align-items-center mr-2'>
          {/* <button
          type = "button" 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-light text-blue-600 w-8 h-2 rounded hover:bg-blue-50 transition"
        >
          {isCreating ? "Cancel" : "Create New Entry"}
        </button> */}
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
                   handleChange(e);
                  }}
                  onPaste={async (e) => {
                    const pastedText = e.clipboardData.getData("text");
                    console.log("Pasted:", pastedText);
                    const response = await callHub(pastedText);
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
          <PlaybookForm type ="readPlaybook"/>
          // <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          //   <h2 className="text-xl font-semibold mb-4">Create New Playbook Entry</h2>
            
          //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          //     <div>
          //       <label className="block mb-1 font-medium">Title</label>
          //       <input
          //         type="text"
          //         className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //         value={newEntry.title}
          //         onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
          //         placeholder="E.g., NextAuth JWT Implementation"
          //       />
          //     </div>
              
          //     <div>
          //       <label htmlFor="set-new-entry" className="block mb-1 font-medium">Category</label>
          //       <select
          //         id="set-new-entry"
          //         className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //         value={newEntry.category}
          //         onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
          //       >
          //         <option value="">Select a category</option>
          //         {categories.filter(c => c !== "All").map(category => (
          //           <option key={category} value={category}>{category}</option>
          //         ))}
          //       </select>
          //     </div>
          //   </div>
            
          //   <div className="mb-4">
          //     <label className="block mb-1 font-medium">Tags (comma separated)</label>
          //     <input
          //       type="text"
          //       className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //       value={newEntry.tags}
          //       onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
          //       placeholder="E.g., authentication, JWT, security"
          //     />
          //   </div>
            
          //   <div className="mb-4">
          //     <label className="block mb-1 font-medium">Steps (one per line)</label>
          //     <textarea
          //       className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          //       value={newEntry.steps}
          //       onChange={(e) => setNewEntry({...newEntry, steps: e.target.value})}
          //       placeholder="1. Install required packages&#10;2. Set up environment variables&#10;3. Create middleware"
          //     />
          //   </div>
            
          //   <div className="mb-4">
          //     <label className="block mb-1 font-medium">Code Snippets</label>
          //     {newEntry.codeSnippets.map((snippet, index) => (
          //       <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
          //         <div className="mb-2">
          //           <label className="block mb-1 text-sm">Language</label>
          //           <input
          //             type="text"
          //             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //             value={snippet.language}
          //             onChange={(e) => updateCodeSnippet(index, 'language', e.target.value)}
          //             placeholder="typescript, javascript, python, etc."
          //           />
          //         </div>
          //         <div>
          //           <label className="block mb-1 text-sm">Code</label>
          //           <textarea
          //             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
          //             value={snippet.code}
          //             onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
          //             placeholder="// Insert your code here"
          //           />
          //         </div>
          //       </div>
          //     ))}
          //     <button
          //       type="button"
          //       className="inline-flex items-center px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          //       onClick={handleAddCodeSnippet}
          //     >
          //       + Add Another Code Snippet
          //     </button>
          //   </div>
            
          //   <div className="mb-4">
          //     <label className="block mb-1 font-medium">References</label>
          //     {newEntry.references.map((reference, index) => (
          //       <div key={index} className="mb-2 flex gap-2">
          //         <input
          //           type="text"
          //           className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //           value={reference.title}
          //           onChange={(e) => updateReference(index, 'title', e.target.value)}
          //           placeholder="Reference title"
          //         />
          //         <input
          //           type="text"
          //           className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          //           value={reference.url}
          //           onChange={(e) => updateReference(index, 'url', e.target.value)}
          //           placeholder="URL"
          //         />
          //       </div>
          //     ))}
          //     <button
          //       type="button"
          //       className="inline-flex items-center px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          //       onClick={handleAddReference}
          //     >
          //       + Add Another Reference
          //     </button>
          //   </div>
            
          //   <div className="mb-6">
          //     <label className="block mb-1 font-medium">Notes & Additional Context</label>
          //     <textarea
          //       className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          //       value={newEntry.notes}
          //       onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
          //       placeholder="Add any additional notes, gotchas, or context that would be helpful to remember"
          //     />
          //   </div>
            
          //   <div className="flex justify-end">
          //     <button
          //       className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          //       onClick={handleCreateEntry}
          //     >
          //       Save Entry
          //     </button>
          //   </div>
          // </div>
        ) : isUpdateNote.isUpdateNote? <PlaybookForm type="updatePlaybook" meta={isMetaToUpdate} setUpdateNote={setUpdateNote}/> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filteredEntries.map(entry => (
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
                    {/* <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition" type='button' key={entry.id} onClick={(e) =>}>
                      View Details
                    </button> */}
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