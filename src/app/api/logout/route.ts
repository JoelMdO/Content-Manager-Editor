import handleLogout from "@/services/authentication/handle_logout";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    ///-----------------------------------
    ///Log out the user from the session
    ///-----------------------------------
    const data = await req.json();
    console.log('data at post', data);
    
    const response = NextResponse.json({status: 200, message: "User logged out"});
    (async () => {
    handleLogout(data);
    })();
    return response
}