import { ref, get } from "firebase/database";
import { database } from "../../../firebase";

async function getSessionBySessionId(sessionId: string, type?: string) {
  
  let sessionIdRef: any;
  //
  if(type === "plate"){
    sessionIdRef = ref(database, `sessionId/${sessionId}`);
    console.log("session found sessionPlate", sessionIdRef);
  } else {
    sessionIdRef = ref(database, `session/${sessionId}`);
    console.log("Session found for no Plate:", sessionId);
  }

  console.log(`Attempting to retrieve session for sessionId: ${sessionId} with type: ${type}`);
  //
  try {
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