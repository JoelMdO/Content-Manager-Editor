import { database } from "../../../firebase";
import { ref, get } from "firebase/database";
const getSessionPlate = async (sessionId: string) => {

    const sessionRef = ref(database, `sessionId/${sessionId}`);

    try {
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
        const sessionData = snapshot.val();
        console.log("Session data:", sessionData);
        console.log("Session Plate at session data:", sessionData.sessionPlate);
        return {status: snapshot.exists(), message: sessionData.sessionPlate}; // Return the session data
    } else {
        console.log("No session data found for this user.");
        return {status: snapshot.exists(), message: "No session data found for this user."};
    }
    } catch (error) {
    console.error("Error getting session data:", error);
    return {status: false, message: error};
    }
}

export default getSessionPlate;