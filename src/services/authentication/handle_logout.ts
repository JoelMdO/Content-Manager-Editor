import { cookies } from "next/headers";
import { auth } from "../../../firebase"; 
import { signOut } from "firebase/auth";
import { database } from "../../../firebase";
import { ref, remove } from "firebase/database";

const handleLogout = async (data: { user: string; sessionId: string }) => {
    ///========================================================
    // Delete data session from Firebase 
    ///========================================================
    //
    const user = data.user!;
    const sessionId = data.sessionId!;
    console.log('user', user);
    console.log('sessionId', sessionId);    
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
    // Above can be not mandatory to be accomplished due to session
    // authentication, but signout will be.
    await signOut(auth);
}

export default handleLogout;