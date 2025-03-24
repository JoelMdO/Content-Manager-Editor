import { authenticateUser } from "@/lib/firebase/authListener";
import firebaseAuth from "@/lib/firebase/firebase_auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// 



export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { email, password, reauth } = body;
    ///SUPABASE
    // const { data, error } = await supabaseAuth(email, password);
    ///FIREBASE
    ///--------------------------------------------------------------------------------------------
    /// Reauthenticate user
    ///--------------------------------------------------------------------------------------------
    // if (reauth){
    //     const cookiesAuth = await cookies();
    //     // Check if user is signed in via cookie
    //     const isSignedIn = cookiesAuth.get("start")?.value;
    //     const token = cookiesAuth.get("token")?.value;
    //     console.log("Cookies at setAuthListener:", isSignedIn);  // Log cookie value
    //     console.log("see all cookies", cookiesAuth.getAll());
    //     auth = await authenticateUser(token!);
    //     if (auth.status === 200){
    //         return NextResponse.json({ status: 200, message: "User authenticated"});
    //     }else{
    //         return NextResponse.json({ status: 401, message: auth.message });
    //     }}
    ///--------------------------------------------------------------------------------------------
    ///First Sign in
    ///--------------------------------------------------------------------------------------------
    const auth = await firebaseAuth(email, password);
    console.log("auth at api/auth", auth);
    if (auth.status === 200){
        console.log("auth as 200", auth);
        return NextResponse.json({ status: 200, message: "User authenticated", session: auth.sessionId });
    }else {
    return NextResponse.json({ status: auth.status, message: auth.message });
    }
}