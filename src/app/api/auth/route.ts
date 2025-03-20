import { authenticateUser } from "@/lib/firebase/authListener";
import firebaseAuth from "@/lib/firebase/firebase_auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// 



export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { email, password, reauth } = body;
    let auth: any
    ///SUPABASE
    // const { data, error } = await supabaseAuth(email, password);
    ///FIREBASE
    /// Reauthenticate user
    if (reauth){
        const cookiesAuth = await cookies();
        // Check if user is signed in via cookie
        const isSignedIn = cookiesAuth.get("start")?.value;
        const token = cookiesAuth.get("token")?.value;
        console.log("Cookies at setAuthListener:", isSignedIn);  // Log cookie value
        console.log("see all cookies", cookiesAuth.getAll());
        auth = await authenticateUser(token!);
        if (auth.status === 200){
            return NextResponse.json({ status: 200, message: "User authenticated"});
        }else{
            return NextResponse.json({ status: 400, message: auth.message });
        }}
    ///First Sign in
    auth = await firebaseAuth(email, password);
    const cookiesAuth = await cookies();
    const isSignedIn = cookiesAuth.get("start")?.value;
        const token = cookiesAuth.get("token")?.value;
        console.log("Cookies at setAuthListener afte first Signup:", isSignedIn, token);  // Log cookie value
        console.log("see all cookies at setAuthListener afte first Signup:", cookiesAuth.getAll());
    if (auth.status === 200){
    console.log("auth at api/auth", auth);
    return auth;
    }else {
    return NextResponse.json({ status: 400, message: auth.message });
    }
}