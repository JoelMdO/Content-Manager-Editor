import handleLogout from "@/services/authentication/handle_logout";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    console.log("Logging out at api/logout");
    //
    const data = await req.json();
    console.log("sessionId at api/logout", data);
    const response = NextResponse.json({status: 200, message: "User logged out"});
    (async () => {
    handleLogout(data);
    })();
    return response
}