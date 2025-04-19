import { NextResponse } from "next/server";
import { dbFireStore } from "../../../../firebaseMain";
import { collection, addDoc } from 'firebase/firestore';
import generateSearchIndex from "@/utils/api/generate_search_index";

export async function POST(req: Request): Promise<Response> {
    
    const data = await req.json();
    const {title, category, tags, steps, notes, codeSnippets, references, lastUpdated, useRecord} = data;
    // Doc to create index for easy search.
    const doc = {title: title, tags: tags, category: category};
     
     const dbRef = await addDoc(collection(dbFireStore, 'playbook'), {     
      title,
      category,
      tags,
      steps,
      notes,
      codeSnippets,
      references,
      searchIndex: generateSearchIndex(doc),
      lastUpdated,
      useRecord});
     
    if(dbRef.id) {
        return NextResponse.json({status: 200, message: "Playbook Data Saved Successfully"});
    } else {
        return NextResponse.json({status: 500, message: "Error on saving"});
    }
}
