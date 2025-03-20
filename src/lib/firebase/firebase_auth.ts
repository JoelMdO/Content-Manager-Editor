import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { auth } from "../../../firebase";   
import { NextResponse } from "next/server";

const firebaseAuth = async (email: string, password: string): Promise<any> =>{
        
        // 
        // let response: Object = {}
        let response = NextResponse.json({});
        const url = process.env.NEXT_PUBLIC_url_api;
        //
        // Perform the authentication
        try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        const token = await user.getIdToken();
        // set a response to send the cookies:
        response = NextResponse.json({status: 200, message: "User authenticated"});
        // Store token in httpOnly cookie (secure)
        // const cookieStore = await cookies();
        response.cookies.set("token", token, {
                httpOnly: true, // Prevents JavaScript access
                secure: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Only in HTTPS
                sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "strict" : "lax", // Prevent CSRF attacks
                path: `${url}/api/post`, // Available across the site
                maxAge: 60 * 60, // 1 hour
                priority: "high"
        });

        const userIsSigned: string = "true";
        response.cookies.set("start", userIsSigned, {
                httpOnly: true, // Prevents JavaScript access
                secure: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Only in HTTPS
                sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "strict" : "lax", // Prevent CSRF attacks
                path: `${url}/api/post`, // Available across the site
                maxAge: 60 * 60,  // 1 hour
                priority: "high"
        });
        // console.log("Cookies:", cookieStore.get("start"));  // Log cookie value
        // response = NextResponse.json({status: 200, message: userCredential.user});
        } catch(e){
        console.log("response at firebase auth", e);
        response = NextResponse.json({status: 400, message: e});
        }
        return response;
}

export default firebaseAuth;
