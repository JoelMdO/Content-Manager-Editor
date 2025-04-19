import { ref, get } from "firebase/database";
import { database } from "../../../firebaseMain";

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