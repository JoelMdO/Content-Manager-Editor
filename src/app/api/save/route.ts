import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { dbFireStore } from "../../../../firebaseMain";
import { collection, addDoc } from "firebase/firestore";
import generateSearchIndex from "@/utils/api/generate_search_index";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "@/services/authentication/read_log";

export async function POST(req: NextRequest): Promise<Response> {
  // {Validate request origin
  try {
    const data = await req.json();

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
      // Parse the request body
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

      // Doc to create index for easy search.
      const doc = { title: title, tags: tags, category: category };

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

      if (dbRef.id) {
        return NextResponse.json({
          status: 200,
          message: "Playbook Data Saved Successfully",
        });
      } else {
        return NextResponse.json({ status: 500, message: "Error on saving" });
      }
    } else {
      return NextResponse.json({
        status: 401,
        message: "Reauthentication failed",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
}
