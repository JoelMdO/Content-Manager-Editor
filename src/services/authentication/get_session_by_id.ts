import { ref, get } from "firebase/database";
import { database } from "../../../firebase";

async function getSessionBySessionId(sessionId: string, type?: string) {
  ///========================================================
  // Function to get the sessionIdReference by sessionId received from 
  // the client side.
  ///========================================================
  let sessionIdRef: any;
  //
    sessionIdRef = ref(database, `session/${sessionId}`);
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
    //
    if (sessionIdSnapshot.exists()) {
      const session = sessionIdSnapshot.val();
      const log = session.session.session.log;
        return log; // Return the session data
      } else {
        return null;
      }
  } catch (error) {
    return null;
  }
}

export default getSessionBySessionId;