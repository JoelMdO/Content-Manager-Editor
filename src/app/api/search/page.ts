import { MongoClient } from "mongodb";
import searchDataValues from "../../../utils/playbook/search_data_values";
import { NextResponse } from "next/server";

export async function POST (req: Request){

    console.log('at search POST');
    
    const uri = process.env.NEXT_PUBLIC_Mongo_uri;
    const client = new MongoClient(uri!);
    await client.connect();
    const db = client.db(process.env.NEXT_PUBLIC_Mongo_db);
    const allDocs = await db.collection(process.env.NEXT_PUBLIC_Mongo_collection!).find().toArray();
    const data = await req.json();
    console.log('data', data);

    try {
    const matches = allDocs.filter(doc => {
    const flat = searchDataValues(doc).join(" ").toLowerCase();
    return flat.includes(data.toLowerCase());
    });
    //
    console.log(matches); 
    if(matches){
        return NextResponse.json({status: 200, message: matches});
    } else {
        return NextResponse.json({status: 204, message: "No Data Found"});
    }
    }catch (error){
        return NextResponse.json({status: 500, message: error});
    }

}