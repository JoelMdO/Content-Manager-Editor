import firebaseAuth from "@/lib/firebase/firebase_auth";
import { NextResponse } from "next/server";
// 



export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { email, password, reauth } = body;
    ///SUPABASE
    // const { data, error } = await supabaseAuth(email, password);
    ///FIREBASE
    ///--------------------------------------------------------------------------------------------
    ///First Sign in
    ///--------------------------------------------------------------------------------------------
    const auth = await firebaseAuth(email, password);
    const response = await auth.json();
    console.log("auth at api/auth", response);
    if (response.status === 200){
        console.log("auth as 200", response);
        return NextResponse.json({ status: 200, message: "User authenticated", session: response.sessionId });
    }else {
    return NextResponse.json({ status: auth.status, message: auth.message });
    }
}