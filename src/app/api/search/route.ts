import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { dbFireStore } from "../../../../firebaseMain";
import {
  collection,
  getDocs,
  query,
  where,
  getDocsFromCache,
  orderBy,
  limit,
} from "firebase/firestore";
import allowedOriginsCheck from "../../../utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { PlaybookMeta } from "../../../components/playbook/types/plabookMeta";
export async function POST(req: NextRequest): Promise<NextResponse> {
  //

  const data = await req.json();
  let meta: PlaybookMeta[] = [];
  const db = collection(dbFireStore, "playbook");
  let snaps: QuerySnapshot<DocumentData> | null = null;

  try {
    const response = allowedOriginsCheck(req);

    if (response!.status == 403) {
      return NextResponse.json({
        status: 403,
        message: "Origin not allowed",
      });
    }
    //

    // Check if the user is authenticated
    const authHeader = req.headers.get("authorization");

    const tokenReceived: string | undefined = authHeader?.split(" ")[1];

    const auth = readLog(tokenReceived ?? "");

    //
    if (auth) {
      ///--------------------------------------------------------
      // Search by search bar item
      ///--------------------------------------------------------
      if (data.type === "playbook-search-bar") {
        snaps = await getDocs(
          query(db, where("searchIndex", "array-contains", data.data))
        );
        ///--------------------------------------------------------
        // Search by category
        ///--------------------------------------------------------
      } else if (data.type === "playbook-search-category") {
        snaps = await getDocs(query(db, where("category", "==", data.data)));
      } else {
        ///--------------------------------------------------------
        // On search initial
        ///--------------------------------------------------------

        /// Get data from catche
        const cachedSnap = await getDocsFromCache(db);

        if (!cachedSnap.empty) {
          const newDocs = cachedSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          //
          if (newDocs.length > 0) {
            meta = newDocs.map((doc) => {
              const d = doc as PlaybookMeta;
              return {
                id: d.id,
                title: d.title,
                category: d.category,
                tags: d.tags,
                notes: d.notes,
                lastUpdated: d.lastUpdated,
              };
            });
          } else {
            /// Fetch data for the last 4 more used

            const q = query(db, orderBy("useRecord", "desc"), limit(4));
            snaps = await getDocs(q);

            if (snaps.empty) {
              const q = query(collection(db, "playbook"), limit(4));
              snaps = await getDocs(q);
              /// If there is no data on the application as user has not inserted anything return a
              /// message no data:
              if (snaps.empty) {
                return NextResponse.json({
                  status: 204,
                  message: "No Data Found",
                });
              }
            }
          }
        }
      }

      meta = snaps!.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        category: doc.data().category,
        tags: doc.data().tags,
        notes: doc.data().notes,
        lastUpdated: doc.data().lastUpdated,
      }));
    }
    //

    if (Object.keys(meta).length > 0) {
      return NextResponse.json({
        status: 200,
        message: "Data found successfully",
        body: meta,
      });
    } else {
      return NextResponse.json({ status: 204, message: "No Data Found" });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: error });
  }
  //}
}
