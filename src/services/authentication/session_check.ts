import "server-only";
import admin from "firebase-admin";
import { v4 as uuidv4 } from 'uuid';
import generateSession from "./generate_session";
import getSessionDB from "./get_session_Id";
import getSessionId from "./get_session_Id";
import getSessionBySessionId from "./get_session_by_id";
import readLog from "./read_log";

async function sessionCheck(sessionId: string) : Promise<{status: number; message: string; user?: string}> {
    //==================================================
    // Check the session ID if same on the database
    //==================================================
    console.log("sessionId", sessionId);
    if(sessionId){
    const hashedSessionIdDB = await getSessionId(sessionId);
    console.log("hashedSessionIdDB", hashedSessionIdDB);
    if(hashedSessionIdDB){
    //==================================================
    // if sessionId matches, obtain the sessionPlate
    // with userId.
    //==================================================
    console.log("sessionPlate", hashedSessionIdDB.message);
    const userId = readLog(hashedSessionIdDB.message);
    console.log('Decrypted Data userId:', userId);
    //==================================================
    // if sessionId matches, obtain the session and
    // decrypt the token
    //==================================================
    const session = await getSessionBySessionId(userId);
    console.log("session", session);
    const log = readLog(session);
    console.log('Decrypted Data Session:', log);
    const token = log.log;
    //==================================================
    // Verify the user ID
    //==================================================
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = decodedToken.uid;
    if(!user){
        console.error("🚨 User not found.");
        return {status: 400, message: "User not longer authenticated. Please sign again."};
    }
    // //==================================================
    // // Token and Session refresh
    // //==================================================
    // if (user){
    // const freshToken = await admin.auth().createCustomToken(user);
    // const newSession = await generateSession(freshToken);
    // return {status: newSession.status, message: "User authenticated", session: newSession.session, user: user};
    // }
    return {status: 200, message: "User authenticated", user: user};
}else{
    return {status: 401, message: "Session not found"};
}
}
return {status: 401, message: "Session not found"};}

export default sessionCheck;