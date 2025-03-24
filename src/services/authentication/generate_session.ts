import "server-only";
import admin from "firebase-admin";
import { v4 as uuidv4 } from 'uuid';
import createLog from "./create_log";

async function generateSession(token: string) : Promise<any>{
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
    // Verify the token and obtain the userId
    //==================================================
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = decodedToken.uid;
    console.log("decodedToken", decodedToken);
    console.log("user", user);
    if(!user){
        console.error("🚨 User not found.");
        return {status: 400, message: "User not found."};
    }
    //==================================================
    // Create a log for the session
    //==================================================
    const log = createLog(token);
    //==================================================    
    // Generate the session
    //==================================================
    const sessionId = uuidv4();
    const sessions: Record<string, { log: any; createdAt: number; validUntil: number }> = {};
    sessions[sessionId] = {
    log,
    createdAt: Date.now(),
    validUntil: Date.now() + (60 * 60 * 1000) // 1 hour
    };
    //==================================================
    // Hash session ID
    //==================================================
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(sessionId);
    const hashedSessionId = hash.digest('hex');
    //==================================================
    // Encrypt Payload
    //==================================================
    const sessionPlate = createLog(user);
    console.log("sessionPlate at generateSession", sessionPlate);
    //==================================================
    // Store the session
    //==================================================
    console.log(`Session created: ${sessionId} for user log: ${log}`);
    return {session: sessions, sessionId: hashedSessionId, user: user, sessionPlate: sessionPlate};
}

export default generateSession;