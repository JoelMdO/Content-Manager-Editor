import handleLogout from "@/lib/firebase/logout";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    console.log("Logging out at api/logout");
    //
    const {sessionId} = await req.json();
    console.log("sessionId at api/logout", sessionId);
    const response = await handleLogout(sessionId);
    if (response.status != 200) 
        console.log("Error logging out at api/logout", response);

    return NextResponse.json({status: response.status, message: response.message});
}