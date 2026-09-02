import "server-only";
import { NextRequest, NextResponse } from "next/server";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
// import readLog from "../../../services/authentication/read_log";
import { JWT } from "next-auth/jwt";
import { fetchLlm } from "@/lib/api/llm_fetch";

export async function POST(req: NextRequest): Promise<Response> {
  //
  // {Validate request origin
  console.log("[SUMMARY_ROUTE_V4] entered", req.url);
  const response = allowedOriginsCheck(req);

  if (response!.status == 403) {
    return NextResponse.json({
      status: 403,
      message: "Origin not allowed",
    });
  }
  //;

  // Check if the user is authenticated
  const data = await req.json();
  // const tokenReceived = data.token;
  // console.log("tokenReceived at api/summary", tokenReceived);
  // const auth = readLog(tokenReceived ?? "");
  // Check if the user is authenticated
  const authHeader = req.headers.get("authorization");

  const tokenReceived: string | JWT | undefined = authHeader?.split(" ")[1];
  console.log("tokenReceived at api/summary", tokenReceived);
  // const auth = readLog(tokenReceived ?? "");
  console.log("api/summary authentication", {
    hasAuthorization: Boolean(tokenReceived),
    // valid: auth,
  });

  //

  // Upload images and update URLs
  // if (auth) {
  if (tokenReceived) {
    console.log("AUTH OK AT API/SUMMARY NEW");
    // Parse individual fields
    const title = data.data.title;
    const article = data.data.body;
    const language = data.data.language;
    const abortSignal = data.signal; // Get the signal from the request body
    console.log("data at resume", data);
    console.log("title", title);
    console.log("article", article);
    console.log("language", language);

    ///--------------------------------------------------------
    // Create a summary of the article content for description
    ///--------------------------------------------------------
    // const authHeader = req.headers.get("authorization");

    // const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];

    // if (!tokenG) {
    //   return NextResponse.json({ status: 401, error: "Unauthorized" });
    // }
    const newUrl = process.env.SUMMARY_URL;
    console.log("newUrl api/summary", newUrl);

    //
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //TODO delete this line in production
    try {
      const resumeResponse = await fetchLlm(`${newUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenReceived}`,
          "Content-Type": "application/json",
          "X-Request-Type": "translation",
          "X-Service": "cms-translate",
          "X-Source-DB": "",
        },
        body: JSON.stringify({
          title: title,
          body: article,
          language: language,
        }),
        signal: abortSignal,
      });

      if (!resumeResponse.ok) {
        const errorText = await resumeResponse.text();

        return NextResponse.json({
          status: 500,
          error: `API returned ${resumeResponse.status}: ${errorText}`,
        });
      }

      const resume = await resumeResponse.json();
      console.log("resume", resume);

      //
      if (resume.success !== true) {
        const errorText = await resume.text();
        return NextResponse.json({
          status: resume.status,
          message: "Error saving data",
          error: errorText,
        });
      }
      return NextResponse.json({
        status: 200,
        message: "Data saved successfully",
        body: resume.article,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Summary request cancelled");
        throw error;
      }

      throw error;
    }
    //
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
