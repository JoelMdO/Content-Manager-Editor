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

export async function POST(req: NextRequest): Promise<NextResponse> {
  //
  console.log('"Request at /save/route.ts:', req);
  console.log('"Request method at /save/route.ts:', typeof req);

  const data = await req.json();
  let meta: object = {};
  const db = collection(dbFireStore, "playbook");
  let snaps: any;
  console.log('"Data at /save/route.ts:', data);
  try {
    console.log("request at /save/route.ts:", req);
    const response = allowedOriginsCheck(req);
    console.log("response at allowedorigincheck", response);

    if (response!.status == 403) {
      return NextResponse.json({
        status: 403,
        message: "Origin not allowed",
      });
    }
    //

    // Check if the user is authenticated
    const authHeader = req.headers.get("authorization");
    console.log('"Authorization header at /save/route.ts:', authHeader);

    const tokenReceived: string | undefined = authHeader?.split(" ")[1];
    console.log('"Token received at /save/route.ts:', tokenReceived);

    const auth = readLog(tokenReceived ?? "");
    console.log('"Auth at /save/route.ts:', auth);

    //
    if (auth) {
      ///--------------------------------------------------------
      // Search by search bar item
      ///--------------------------------------------------------
      if (data.type === "playbook-search-bar") {
        snaps = await getDocs(
          query(db, where("searchIndex", "array-contains", data.data.data))
        );
      } else if (data.type === "playbook-search-category") {
        ///--------------------------------------------------------
        // Search by category
        ///--------------------------------------------------------

        snaps = await getDocs(
          query(db, where("category", "==", data.data.data))
        );
      } else {
        ///--------------------------------------------------------
        // On search initial
        ///--------------------------------------------------------

        /// Get data from catche
        const cachedSnap = await getDocsFromCache(db);

        if (!cachedSnap.empty) {
          snaps = cachedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    //
    meta = snaps.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.data().title,
      category: doc.data().category,
      tags: doc.data().tags,
      notes: doc.data().notes,
      lastUpdated: doc.data().lastUpdated,
    }));
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
