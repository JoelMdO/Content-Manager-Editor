import { NextResponse } from "next/server";
import { dbFireStore } from '../../../../firebase';
import { collection, getDocs, query, where } from "firebase/firestore";

export async function POST(req: Request): Promise<Response> {

    console.log('at search POST');
    const data = await req.json();
    
    let meta: object = {};
    
    const db = collection(dbFireStore, 'playbook');
    console.log('data type', data.type);
    let snaps: any;
    
    try {
        if (data.type === "playbook-search-bar") {
            console.log('doing search bar');
            console.log('data at search bar', data.data);
            console.log('data the data', data.data.data);
            snaps = await getDocs(query(db, where("searchIndex", "array-contains", data.data.data)));

        } else if (data.type === "playbook-search-category") {
            snaps = await getDocs(query(db, where("category", "==", data.data.data)));
        } else {
            snaps = await getDocs(collection(dbFireStore, "playbook"));
        }
        //
        meta = snaps.docs.map((doc: any) => ({
            id: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            tags: doc.data().tags,
            lastUpdated: doc.data().lastUpdated
        }));
        //
        if (Object.keys(meta).length > 0) {
            return NextResponse.json({ status: 200, message: "Data found successfully", body: meta });
        } else {
            return NextResponse.json({ status: 204, message: "No Data Found" });
        }
    } catch (error) {
        return NextResponse.json({ status: 500, message: error });
    }

};