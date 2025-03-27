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
    if(!user){
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
    const body_session: Object = {
    log,
    createdAt: Date.now(),
    validUntil: Date.now() + (60 * 60 * 1000) // 1 hour
    };
    //==================================================
    // Hash session ID
    //==================================================
    const crypto = require('crypto');
    const hash = crypto.createHash(process.env.NEXT_PUBLIC_HASH_ALGORITHM!);
    hash.update(sessionId);
    const hashedSessionId = hash.digest(process.env.NEXT_PUBLIC_HASH_DIGEST!);
    //==================================================
    // Encrypt Payload
    //==================================================
    const sessionPlate = createLog(user);
    //==================================================
    // Store the session
    //==================================================
    return {session: body_session, sessionId: hashedSessionId, user: user, sessionPlate: sessionPlate};
}

export default generateSession;