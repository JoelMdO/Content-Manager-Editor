import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies, headers } from "next/headers";
import { auth } from "../../../firebase";   
import { NextResponse } from "next/server";
import generateSession from "@/services/authentication/generate_session";
import { database } from "../../../firebase";
import { ref, set, update } from "firebase/database";

const firebaseAuth = async (email: string, password: string): Promise<any> =>{
        
        // 
        // let response: Object = {}
        let response = NextResponse.json({});
        console.log("🔍 Checking Firebase Auth:");
        //
        // Perform the authentication
        try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        const token = await user.getIdToken();
        if(!token){
                console.log("No Token:");
                return {status: 400, message: "Authentication failed"};
        }console.log("Token:", token);
        //--------------------------------------------------------------------------------
        // Generate a session
        //--------------------------------------------------------------------------------
        const session = await generateSession(token);
        console.log("Session:", session);
        if(session.status === 400){
        return NextResponse.json({status: 400, message: session.message});
        }
        // Send a 200 response immediately
        const response = NextResponse.json({ status: 200, message: "User authenticated", sessionId: session.sessionId});
        console.log("response at firebase auth", response);
        console.log("User signed in successfully");
        //--------------------------------------------------------------------------------
        // Store the session
        //--------------------------------------------------------------------------------
        (async () => {
        console.log("session.user", session.user);
        const dbRef = ref(database, `session/${session.user}`);  
        await update(dbRef, {session, "sessionID": session.sessionId});
        //--------------------------------------------------------------------------------
        // Store the sessionId
        //--------------------------------------------------------------------------------
        const dbRef2 = ref(database, `sessionId/${session.sessionId}`);  
        await update(dbRef2, {"sessionPlate": session.sessionPlate});
        //--------------------------------------------------------------------------------
        console.log("Background tasks completed successfully.");
        })();
        // set a response to send the cookies:
        // response = NextResponse.json({status: 200, message: "User authenticated"});
        // Store token in httpOnly cookie (secure)
        // // const cookieStore = await cookies();
        // response.cookies.set("session", session, {
        //         httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Prevents JavaScript access
        //         secure: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Only in HTTPS
        //         sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "strict" : "lax", // Prevent CSRF attacks
        //         path: `/`, // Available across the site
        //         maxAge: 60 * 60, // 1 hour
        //         priority: "high"
        // });

        // const userIsSigned: string = "true";
        // response.cookies.set("start", userIsSigned, {
        //         httpOnly: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Prevents JavaScript access
        //         secure: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Only in HTTPS
        //         sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "strict" : "lax", // Prevent CSRF attacks
        //         path: `/`, // Available across the site
        //         maxAge: 60 * 60,  // 1 hour
        //         priority: "high"
        // });
        return response;  
        } catch(e){
        console.log("response at firebase auth", e);
        return{status: 400, message: e};
        }
}

export default firebaseAuth;
