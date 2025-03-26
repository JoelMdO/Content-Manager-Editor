import { ref, get } from "firebase/database";
import { database } from "../../../firebase";
import { getAuth } from "firebase/auth";

async function getSessionBySessionId(sessionId: string, type?: string) {
  
  let sessionIdRef: any;
  //
  // if(type === "plate"){
  //   ""
  // } else {
    sessionIdRef = ref(database, `session/${sessionId}`);
    console.log("SessionIDRef found at getSessionBySessionId:", sessionIdRef);
  //}

  console.log(`Attempting to retrieve session for sessionId: ${sessionId} with type: ${type}`);
  //
  try {
  

    // const auth = getAuth();
    // const user = auth.currentUser;
    // console.log("auth", auth);
    // console.log("user", user);
    // if (!user) {
    //   console.error("User is not authenticated.");
    // }
    // // const uid = user.uid;
    // // console.log("Authenticated user UID:", uid);
    // if (user) {
    //   const idTokenResult = await user.getIdTokenResult();
    //   const expirationTime = new Date(idTokenResult.expirationTime);
    //   console.log("Token expiration time:", expirationTime);
    //   console.log("Authenticated user UID:", user.uid);
    
    //   if (expirationTime < new Date()) {
    //     console.error("Authentication token has expired.");
    //   }
    // if (sessionId !== user.uid) {
    //   console.error("Session ID does not match the authenticated user's UID.");
    // }}
    //
    const sessionIdSnapshot = await get(sessionIdRef);

    if (sessionIdSnapshot.exists()) {
      console.log("session found sessionPlate", sessionIdSnapshot.val());
      const session = sessionIdSnapshot.val();
      const log = session.session.session.log;
      console.log("log", log);
        return log; // Return the session data
      } else {
        console.log("No session data found for this userId.");
        return null;
      }
  } catch (error) {
    console.error("Error getting session by sessionId:", error);
    return null;
  }
}

export default getSessionBySessionId;