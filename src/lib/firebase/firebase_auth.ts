import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";   
import { NextResponse } from "next/server";
import generateSession from "@/services/authentication/generate_session";
import { database } from "../../../firebase";
import { ref, update } from "firebase/database";

const firebaseAuth = async (email: string, password: string): Promise<any> =>{
        //
        // Perform the authentication
        try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        
        const token = await user.getIdToken();
        
        if(!token){
                return NextResponse.json({status: 400, message: "Authentication failed"});
        }
        //--------------------------------------------------------------------------------
        // Generate a session
        //--------------------------------------------------------------------------------
        const session = await generateSession(token); 
        
        if(session.status === 400){
        return NextResponse.json({status: 400, message: session.message});
        }
        // Send a 200 response immediately
        const response = NextResponse.json({ status: 200, message: "User authenticated", sessionId: session.sessionId});
        //--------------------------------------------------------------------------------
        // Store the session
        //--------------------------------------------------------------------------------
        (async () => {
        const dbRef = ref(database, `session/${session.user}`);  
        update(dbRef, {session});
        //--------------------------------------------------------------------------------
        // Store the sessionId
        //--------------------------------------------------------------------------------
        const dbRef2 = ref(database, `sessionId/${session.sessionId}`);  
        update(dbRef2, {"sessionPlate": session.sessionPlate});
        //--------------------------------------------------------------------------------
        })();
        //  
        return response;
        } catch(e){
        //
        return NextResponse.json({status: 400, message: e});
        }
        
}

export default firebaseAuth;
