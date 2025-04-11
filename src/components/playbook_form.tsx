'use client';
import { useCodeSnippets } from '../utils/playbook/code_snippet_hook';
import { useReferences } from '../utils/playbook/references_hook';
import { ArrowLeft, Plus, Trash, Save, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import categories from '../utils/categories';
import handleSubmit from '../utils/playbook/handleSubmit';
import { useRouter } from 'next/navigation';
import CustomButton from './buttons/custom_buttons';
//
export interface PlaybookFormProps  {
    type?: string;
    meta?: {id: string;
      title: string;
      category: string;
      tags: string[];
      lastUpdated: string;
      steps?: string[];
      codeSnippets?: [{ code: string; language: string }];
      references?: [{title: string, link: string}];
      notes?: string;
      };
     setUpdateNote?: React.Dispatch<React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>>;
}
//
export default function PlaybookForm({ type, meta, setUpdateNote }: PlaybookFormProps) {
    //
    const color_bg_inputs = "bg-gray-forms";
    const router = useRouter();
    //
    const {
        codeSnippets,
        addCodeSnippet,
        removeCodeSnippet,
        updateCodeSnippet,
        updateCodeSnippetPaste
      } = useCodeSnippets();
      const {
        references,
        addReference,
        removeReference,
        updateReference,
        updateReferencePaste
      } = useReferences(); 
      //
      const [title, setTitle] = useState<string>('');
      const [category, setCategory] = useState<string>('');
      const [isEditing, setIsEditing] = useState<boolean>(true);
      const [isCategories, setCategories] = useState<string[]>(categories);
      const [tags, setTags] = useState<string[]>([]);
      const [steps, setSteps] = useState<string[]>([]);
      const [tagInput, setTagInput] = useState('');
      const [stepInput, setStepInput] = useState('');
      const [notes, setNotes] = useState<string>('');
      const [isSaving, setIsSaving] = useState(false);
      const [saveSuccess, setSaveSuccess] = useState(false);
      //
      const resetForm = () => {
        setTitle('');
        setCategory('');
        setTags([]);
        setSteps([]);
        setNotes('');
    
        codeSnippets.forEach((_, index) => removeCodeSnippet(index));
        references.forEach((_, index) => removeReference(index));
    };
    //
     useEffect(() => {
          // This would be replaced with a real API call in production
          if(type === undefined){
          const data = sessionStorage.getItem("playbook-item");
          if(data){
            const jsonData = JSON.parse(data);
            const mockData = {
              title: jsonData.title,
              category: jsonData.category,
              tags: jsonData.tags,
              steps: jsonData.steps,
              codeSnippets: jsonData.codeSnippets,
              references: jsonData.references,
              notes: jsonData.notes,
            };
            console.log('mockData', mockData);
            
          // const mockData = {
          //   id: '12345',
          //   title: "JWT Authentication Implementation",
          //   category: "Authentication",
          //   tags: "JWT,Auth,Security",
          //   steps: "Install required packages: npm install jsonwebtoken\nSet up environment variables for JWT_SECRET\nCreate auth middleware to verify tokens",
          //   codeSnippets: [
          //     {
          //       language: "typescript",
          //       code: "import jwt from 'jsonwebtoken';\n\nexport const generateToken = (userId: string) => {\n  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });\n};"
          //     }
          //   ],
          //   references: [
          //     { title: "JWT Documentation", link: "https://jwt.io/introduction" },
          //     { title: "Auth Best Practices", link: "https://example.com/auth-best-practices" }
          //   ],
          //   notes: "Remember to refresh tokens before expiry. Consider using httpOnly cookies for better security.",
          //   lastUpdated: "2025-04-01"
          // };
          
         // Set individual state values
         setTitle(mockData.title);
         setCategory(mockData.category);
         setTags(mockData.tags);
         setSteps(mockData.steps);
         setNotes(mockData.notes);
         mockData.codeSnippets.forEach((snippet: { language: string; }, index: number) => updateCodeSnippet(index, 'language', snippet.language));
         mockData.codeSnippets.forEach((snippet: { code: string; }, index: number) => updateCodeSnippet(index, 'code', snippet.code));
         mockData.references.forEach((reference: { title: string; }, index: number) => updateReference(index, 'title', reference.title));
         mockData.references.forEach((reference: { link: string; }, index: number) => updateReference(index, 'link', reference.link));
          }} else if (meta) {
            console.log('meta at playbook form', meta);
            
         setTitle(meta!.title);
         setCategory(meta!.category);
         setTags(meta!.tags!);
         setSteps(meta!.steps!);
         setNotes(meta!.notes!);
         meta!.codeSnippets!.forEach((snippet: { language: string; }, index: number) => updateCodeSnippet(index, 'language', snippet.language));
         meta!.codeSnippets!.forEach((snippet: { code: string; }, index: number) => updateCodeSnippet(index, 'code', snippet.code));
         meta!.references!.forEach((reference: { title: string; }, index: number) => updateReference(index, 'title', reference.title));
         meta!.references!.forEach((reference: { link: string; }, index: number) => updateReference(index, 'link', reference.link));
          }
    
     }, []);
    //

    return (
        <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={(e) => handleSubmit( e, setIsSaving, setSaveSuccess, title, category, tags, steps, notes, codeSnippets, references, resetForm, router)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    id="title"
                    className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black`}
                    placeholder="E.g., NextAuth JWT Implementation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                {/*Left Column - Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    id="category"
                    className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                 {/* Right Column - Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated) *</label>
                  <input
                    type="text"
                    id="tags"
                    className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black`}
                    placeholder="E.g., Auth, JWT, Security"
                    value={tagInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTagInput(value);
                      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                      setTags(tagsArray)
                      e.preventDefault();
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Add relevant keywords to make this entry easier to find later</p>
                </div>
                {/* Right Column - Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes & Additional Context</label>
                  <textarea
                    id="notes"
                    className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 placeholder:text-black`}
                    placeholder="E.g., Remember to refresh token before expires, Add package named..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Left Column - Steps */}
              <div>
                <div>
                  <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">Steps (one per line) *</label>
                  <textarea
                    id="steps"
                    className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 placeholder:text-black`}
                    placeholder="1. Install required packages&#10;2. Set up environment variables&#10;3. Create middleware&#10;4. Example usage"
                    value={stepInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStepInput(value);
                      const tagsArray = value.split("\n").map(tag => tag.trim()).filter(tag => tag !== '');
                      setSteps(tagsArray)}}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Break down the process into clear, sequential steps</p>
                </div>
              </div>
            </div>
            
            {/* Code Snippets Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Code Snippets</h3>
                <button 
                  type="button" 
                  onClick={()=> addCodeSnippet()}
                  className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded-md hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-1" />
                  Add Snippet
                </button>
              </div>
              
              {codeSnippets.map((snippet, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Snippet {index + 1}</h4>
                    {codeSnippets.length >= 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCodeSnippet(index)}
                        className="inline-flex items-center p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove code snippet"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <input
                        type="text"
                        className={`w-full p-2 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black `}
                        placeholder="typescript, javascript, python, etc."
                        value={snippet.language}
                        onChange={(e) => updateCodeSnippet(index, 'language', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* {snippet.image ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <img src={snippet.image} alt="Pasted snippet" className="w-full h-auto rounded-md" />
                    </div>
                  ) : ( */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <textarea
                      className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 font-mono text-sm placeholder:text-black`}
                      placeholder="// Insert your code here"
                      value={snippet.code}
                      onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
                      onPaste={(e) => updateCodeSnippetPaste(index, e)}
                    />
                  </div>
                  {/* )} */}
                </div>
              ))}
            </div>
            
            {/* References Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">References</h3>
                <button 
                  type="button" 
                  onClick={addReference}
                  className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded-md hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-1" />
                  Add Reference
                </button>
              </div>
              
              {references.map((reference, index) => (
                <div key={index} className="mb-3 flex items-center gap-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black`}
                      placeholder="Reference title (e.g., Official Documentation)"
                      value={reference.title}
                      onChange={(e) => updateReference(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex-grow flex items-center">
                    <LinkIcon size={16} className="text-gray-400 mr-2" />
                    <input
                      type="url"
                      className={`w-full p-3 border border-gray-300 ${color_bg_inputs} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black`}
                      placeholder="URL (e.g., https://example.com/docs)"
                      value={reference.link}
                      onChange={(e) => updateReference(index, 'link', e.target.value)}
                      onPaste={(e) => updateReferencePaste(index, e)}
                    />
                  </div>
                  
                  {references.length >= 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeReference(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Remove code snippet"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 border-t pt-6">
              {/* <Link href="/playbook">
                <button 
                  type="button" 
                  className="px-6 py-3 bg-gray-300 border border-gray-300 text-gray-700 rounded-md hover:bg-blue-light"
                >
                  Cancel
                </button>
              </Link> */}
              <CustomButton type={type!} setUpdateNote={setUpdateNote}/>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {isEditing ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
            
            {saveSuccess && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Entry {isEditing ? 'updated' : 'saved'} successfully!
              </div>
            )}
          </form>
        </div>
        </>
    )
};