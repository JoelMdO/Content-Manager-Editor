import "server-only";
import admin from "firebase-admin";
import getSessionBySessionId from "./get_session_by_id";
import readLog from "./read_log";
import getSessionPlate from "./get_session_plate";

async function sessionCheck(sessionId: string, type?: string) : Promise<{status: number; message: string; user?: string}> {
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
    //==================================================
    // Verify the user ID
    //==================================================
    let user: string; 
    try{
    const decodedToken = await admin.auth().verifyIdToken(token);
    user = decodedToken.uid;
    if(!user){
        return {status: 400, message: "User not longer authenticated. Please sign again."};
    }
    } catch (error) {
    // if(decodedToken.error === "Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."){
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
    }
    return {status: 200, message: "User authenticated", user: user};
}else{
    return {status: 401, message: "Session not found"};
}
}
return {status: 401, message: "Session not found"};}

export default sessionCheck;