import { NextResponse } from "next/server";
import { dbFireStore } from "../../../../firebase";
import { collection, addDoc } from 'firebase/firestore';
import generateSearchIndex from "@/utils/api/generate_search_index";

export async function POST(req: Request): Promise<Response> {
    
    console.log('at save POST');
    
    const uri = process.env.NEXT_PUBLIC_Mongo_uri;
    // const client = new MongoClient(uri!);
    // await client.connect();
    // const db = client.db(process.env.NEXT_PUBLIC_Mongo_db);
    // const collection = db.collection(process.env.NEXT_PUBLIC_Mongo_collection!);
    const data = await req.json();
    console.log('data', data);
    
    const {title, category, tags, steps, notes, codeSnippets, references, lastUpdated} = data;
    // Doc to create index for easy search.
    const doc = {title: title, tags: tags, category: category};
    console.log('title', title);
     
     const dbRef = await addDoc(collection(dbFireStore, 'playbook'), {     
      title,
      category,
      tags,
      steps,
      notes,
      codeSnippets,
      references,
      searchIndex: generateSearchIndex(doc),
      lastUpdated});

     console.log('response Mong', dbRef.id);
     
    if(dbRef.id) {
        return NextResponse.json({status: 200, message: "Playbook Data Saved Successfully"});
    } else {
        return NextResponse.json({status: 500, message: "Error on saving"});
    }
}
