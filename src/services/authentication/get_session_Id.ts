import { database } from "../../../firebase";
import { ref, get } from "firebase/database";
const getSessionId = async (sessionId: string) => {

    const sessionRef = ref(database, `sessionId/${sessionId}`);

    try {
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
        const sessionData = snapshot.val();
        console.log("Session data:", sessionData);
        return snapshot.exists(); // Return the session data
    } else {
        console.log("No session data found for this user.");
        return false;
    }
    } catch (error) {
    console.error("Error getting session data:", error);
    return false;
    }
}

export default getSessionId;