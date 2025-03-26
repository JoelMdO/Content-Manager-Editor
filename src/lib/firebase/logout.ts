import { cookies } from "next/headers";
import { auth } from "../../../firebase"; 
import { signOut } from "firebase/auth";
import { database } from "../../../firebase";
import { ref, remove } from "firebase/database";

const handleLogout = async (sessionId: string) => {
try {
    // Firebase sign out
    console.log("sessionID at handleLogout", sessionId);
    const dbRef = ref(database, `session/${sessionId}`);
    await remove(dbRef);
    const dbRef2 = ref(database, `sessionId/${sessionId}`);
    await remove(dbRef2);
    await signOut(auth);
    console.log("✅ User logged out");
    
    return {status: 200, message: "User logged out"};
} catch (error) {
    return {status: 500, message: "Error logging out: " + (error as { message: string })};
}
}

export default handleLogout;