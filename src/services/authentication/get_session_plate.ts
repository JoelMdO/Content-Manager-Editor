import { database } from "../../../firebaseMain";
import { ref, get } from "firebase/database";
const getSessionPlate = async (sessionId: string) => {
    ///========================================================
    // Function to get the session storage from database 
    ///========================================================
    const sessionRef = ref(database, `sessionId/${sessionId}`);

    try {
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
        const sessionData = snapshot.val();
        return {status: snapshot.exists(), message: sessionData.sessionPlate}; // Return the session data
    } else {
        return {status: snapshot.exists(), message: "No session data found for this user."};
    }
    } catch (error) {
    return {status: false, message: error};
    }
}

export default getSessionPlate;