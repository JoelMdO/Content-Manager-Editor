import { auth } from "../../../firebaseMain"; 
import { signOut } from "firebase/auth";
import { database } from "../../../firebaseMain";
import { ref, remove } from "firebase/database";
import { destroyCookie } from "nookies";

const handleLogout = async (data: { user: string; sessionId: string }) => {
    ///========================================================
    // Delete data session from Firebase 
    ///========================================================
    //
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
    // Above can be not mandatory to be accomplished due to session
    // authentication, but signout will be.
    await signOut(auth);
    destroyCookie(null, 'authToken', { path: '/' });
}

export default handleLogout;