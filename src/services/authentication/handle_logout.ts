import { auth } from "../../../firebase"; 
import { signOut } from "firebase/auth";
import { database } from "../../../firebase";
import { ref, remove } from "firebase/database";

const handleLogout = async (data: { user: string; sessionId: string }) => {
    // Delete data session from Firebase
    const user = data.user!;
    const sessionId = data.sessionId!;
    //
    if (user){
    const dbRef = ref(database, `session/${user}`);
    try{
    await remove(dbRef);
    } catch(error){
    }}
    try{
    const dbRef2 = ref(database, `sessionId/${sessionId}`);
    await remove(dbRef2);
    } catch(error){
    }
    await signOut(auth);
}

export default handleLogout;