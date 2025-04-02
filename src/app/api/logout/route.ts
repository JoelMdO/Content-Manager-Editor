import handleLogout from "@/services/authentication/handle_logout";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {

    //
    const data = await req.json();
    console.log('data at api/logout POST', data);
    
    const response = NextResponse.json({status: 200, message: "User logged out"});
    (async () => {
    handleLogout(data);
    })();
    return response;
}