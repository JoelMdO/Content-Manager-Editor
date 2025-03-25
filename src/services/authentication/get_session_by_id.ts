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
    console.log("Session found for no Plate:", sessionIdRef);
  //}

  console.log(`Attempting to retrieve session for sessionId: ${sessionId} with type: ${type}`);
  //
  try {
  

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated.");
      return null;
    }

    const uid = user.uid;
    console.log("Authenticated user UID:", uid);
    const sessionIdSnapshot = await get(sessionIdRef);

    if (sessionIdSnapshot.exists()) {
      console.log("session found sessionPlate", sessionIdSnapshot.val());
        return sessionIdSnapshot.val(); // Return the session data
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