import { cookies } from "next/headers";
import { auth } from "../../../firebase"; 
import { signOut } from "firebase/auth";
import { database } from "../../../firebase";
import { ref, remove } from "firebase/database";

const handleLogout = async (data: { user: string; sessionId: string }) => {
    // Delete data session from Firebase
    const user = data.user!;
    const sessionId = data.sessionId!;
    console.log("user at handleLogout", user);
    console.log("sessionId at handleLogout", sessionId);
    //
    if (user){
    const dbRef = ref(database, `session/${user}`);
    try{
    await remove(dbRef);
    } catch(error){
     console.log("session not deleted");
    }}
    try{
    const dbRef2 = ref(database, `sessionId/${sessionId}`);
    await remove(dbRef2);
    } catch(error){
     console.log("session not deleted");
    }
    await signOut(auth);
    console.log("✅ User logged out");
}

export default handleLogout;