import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    
    console.log('at save POST');
    
    const uri = process.env.NEXT_PUBLIC_Mongo_uri;
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(process.env.NEXT_PUBLIC_Mongo_db);
    const collection = db.collection(process.env.NEXT_PUBLIC_Mongo_collection!);
    const data = await req.json();
    console.log('data', data);
    
    const {title, category, tags, steps, notes, codeSnippets, references, lastUpdate} = data;
    console.log('title', title);
    
    const response = await collection.insertOne({
      title,
      category,
      tags,
      steps,
      notes,
      codeSnippets,
      references,
      lastUpdate
    });
     console.log('response Mong', response);
     
    if(response.acknowledged) {
        return NextResponse.json({status: 200, message: "Playbook Data Saved Successfully"});
    } else {
        return NextResponse.json({status: 500, message: response});
    }
}