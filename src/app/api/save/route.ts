import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { dbFireStore } from "../../../../firebaseMain";
import { collection, addDoc } from "firebase/firestore";
import generateSearchIndex from "@/utils/api/generate_search_index";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/nextauth/auth";
import { all } from "cypress/types/bluebird";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "@/services/authentication/read_log";
import { log } from "console";

export async function POST(req: NextRequest): Promise<Response> {
  // {Validate request origin
  try {
    const data = await req.json();
    console.log('"Data at /save/route.ts:', data);

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
      // Parse the request body
      log("Data received at /save/route.ts:", data);
      const {
        title,
        category,
        tags,
        steps,
        notes,
        codeSnippets,
        references,
        lastUpdated,
        useRecord,
      } = data;
      console.log("Handling POST request at /save", data);

      // Doc to create index for easy search.
      const doc = { title: title, tags: tags, category: category };
      console.log("doc at handling post", doc);

      const dbRef = await addDoc(collection(dbFireStore, "playbook"), {
        title,
        category,
        tags,
        steps,
        notes,
        codeSnippets,
        references,
        searchIndex: generateSearchIndex(doc),
        lastUpdated,
        useRecord,
      });
      console.log("Database reference after adding document:", dbRef);

      if (dbRef.id) {
        console.log("Playbook data saved successfully with ID:", dbRef.id);

        return NextResponse.json({
          status: 200,
          message: "Playbook Data Saved Successfully",
        });
      } else {
        console.log("Error saving playbook data");

        return NextResponse.json({ status: 500, message: "Error on saving" });
      }
    } else {
      console.log("User not authenticated or session expired");

      return NextResponse.json({
        status: 401,
        message: "Reauthentication failed",
      });
    }
  } catch (error) {
    console.error("Error in /save/route.ts:", error);
    return NextResponse.json({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
}
