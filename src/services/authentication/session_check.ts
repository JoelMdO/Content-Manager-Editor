import "server-only";
import admin from "firebase-admin";
import getSessionBySessionId from "./get_session_by_id";
import readLog from "./read_log";
import getSessionPlate from "./get_session_plate";

async function sessionCheck(sessionId: string, id?: string, title?: string, body?: string, images?: object, bold?: string[], italic?: string[]) : Promise<{status: number; message: string; user?: string}> {
    //==================================================
    // Check the session ID if same on the database
    //==================================================
    
    if(sessionId){
    const SessionPlateId = await getSessionPlate(sessionId);
    if(SessionPlateId){
    //==================================================
    // if sessionId matches, obtain the sessionPlate
    // with userId.
    //==================================================
    const userId = readLog(SessionPlateId.message);
    //==================================================
    // if sessionId matches, obtain the session and
    // decrypt the token
    //=============================Res=====================
    const logRes = await getSessionBySessionId(userId);
    const log = readLog(logRes);
    const token = log;
    ///==================================================
    /// Initialize SDK for server
    ///--------------------------------------------------
    if(!admin.apps.length){
    const serviceAccount = {
        "type": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_type,
        "project_id": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_project_id,
        "private_key_id": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_private_key_id,
        "private_key": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_private_key!.replace(/\\n/g, '\n'),
        "client_email": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_client_email,
        "client_id": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_client_id,
        "auth_uri": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_auth_uri,
        "token_uri": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_token_uri,
        "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_client_x509_cert_url,
        "universe_domain": process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_universe_domain
    }
    const account =JSON.parse(JSON.stringify(serviceAccount));
    admin.initializeApp({
    credential: admin.credential.cert(account),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_databaseURL
    });}
    //==================================================
    // Verify the user ID
    //==================================================
    let user: string; 
    ///==================================================
    
    try{
    const decodedToken = await admin.auth().verifyIdToken(token);
    user = decodedToken.uid;
        
    if(!user){
        return {status: 400, message: "User not longer authenticated. Please sign again."};
    }

        return {status: 200, message: "User authenticated"};

    } catch (error) {
        // Detect specific Firebase Auth errors
        const errorMessage: string = String(error);
        // Get a fresh ID token from your client app and try again (auth/id-token-expired).
        if (errorMessage.includes("Firebase ID token has expired.")) {
            // Get a customToken
            const customToken = await admin.auth().createCustomToken(userId);
            // Sign in with the custom token
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token,
                returnSecureToken: true,
            }),
            });
            const data = await response.json();
            
            if (!response.ok) {
            return {status: 400, message: `Failed to refresh token, ${data}`};
            }
            const decodedToken = await admin.auth().verifyIdToken(data.refresh_token);
            user = decodedToken.uid;
            if(!user){
                return {status: 400, message: "User not longer authenticated. Please sign again."};
            }
            return {status: 200, message: "User authenticated", user: user};
        }else{
            return {status: 401, message: "Session not found"};
        }
    }
}
return {status: 401, message: "SessionId not found"};
}
return {status: 401, message: "SessionPlateId not found"};
}

export default sessionCheck;