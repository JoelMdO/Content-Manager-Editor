import firebaseAuth from "../../../lib/firebase/firebase_auth";
import { NextResponse } from "next/server";
import sessionCheck from "@/services/authentication/session_check";
// 

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { email, password, reauth, sessionId } = body;
    
    
    ///========================================================
    // Perform a  reauthentication when the token is received
    // from the middleware.
    ///========================================================
    if(reauth){

        const response = await sessionCheck(sessionId);

        if(response.status === 200){
            return  NextResponse.json({status: 400, message: "User not longer authenticated. Please sign again."});
        }
        return NextResponse.json({ status: 200, message: "User authenticated" });
    }
    ///--------------------------------------------------------------------------------------------
    /// IF not session or token arlready, sign in with Firebase authentication.
    ///--------------------------------------------------------------------------------------------
    const auth = await firebaseAuth(email, password);
    const fireAuthResponse = await auth.json();
    
    if (fireAuthResponse.status === 200){
           return NextResponse.json({ status: 200, message: "User authenticated", session: fireAuthResponse.sessionId });;
    }else {
    return NextResponse.json({ status: auth.status, message: auth.message });
    }
}