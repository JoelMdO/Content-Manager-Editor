import { cookies } from "next/headers";
import { auth } from "../../../firebase"; 
import { signOut } from "firebase/auth";

const handleLogout = async () => {
try {
    // Firebase sign out
    await signOut(auth); 

    // Clear the authentication cookies
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("start");

    console.log("✅ User logged out");
    
    return {status: 200, message: "User logged out"};
} catch (error) {
    return {status: 500, message: "Error logging out: " + (error as { message: string })};
}
}

export default handleLogout;