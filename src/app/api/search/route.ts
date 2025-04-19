import { NextResponse } from "next/server";
import { dbFireStore } from '../../../../firebaseMain';
import { collection, getDocs, query, where, getDocsFromCache, orderBy, limit } from "firebase/firestore";

export async function POST(req: Request): Promise<Response> {

    const data = await req.json();    
    let meta: object = {};
    const db = collection(dbFireStore, 'playbook');
    let snaps: any;
    //
    try {
        if (data.type === "playbook-search-bar") {

            snaps = await getDocs(query(db, where("searchIndex", "array-contains", data.data.data)));

        } else if (data.type === "playbook-search-category") {
            snaps = await getDocs(query(db, where("category", "==", data.data.data)));
        } else {

            // Get data from catche
            const cachedSnap = await getDocsFromCache(collection(db, 'playbook'));
            if (!cachedSnap.empty) {
            snaps = cachedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } else {
                
            /// Fetch data for the last 4 more used    
            const q = query(collection(db, 'playbook'), orderBy('useRecord', 'desc'), limit(4));
            snaps = await getDocs(q);
            if (snaps.empty){
            const q = query(collection(db, 'playbook'), limit(4));
            snaps = await getDocs(q);    
            }
            }
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