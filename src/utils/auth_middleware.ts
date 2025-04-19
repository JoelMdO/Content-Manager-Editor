import 'server-only';
import { database } from "../../firebaseMain";
import { ref, get } from "firebase/database";


const authMiddleware = async (req: any): Promise<{status: number}> =>{
    const url = req.nextUrl.clone();
    const sessionId = req.cookies.get('sessionId')?.value; // Retrieve sessionId from cookies
    
    // If no sessionId is found, redirect to login
    if (sessionId === undefined) {
      return {status: 401};
    }
  
    // Validate sessionId in Firebase Realtime Database
    const dbRef = ref(database, `sessionId/${sessionId}`);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) {
      // If sessionId is invalid, redirect to login
      return {status: 401};
    }
  
    // If sessionId is valid, allow access to the requested route
    return {status: 200};
  }

export default authMiddleware;