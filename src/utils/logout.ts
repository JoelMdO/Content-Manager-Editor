import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // For redirection
import { cookies } from "next/headers";
const logout = async () => {
  ///========================================================
  // Function to log out the user
  ///========================================================
    try {
    const router = useRouter();
    const auth = getAuth();
    await signOut(auth); // Firebase sign out

      // Redirect to login page
    router.push("/");
    } catch (error) {
    
    }
};

export default logout()