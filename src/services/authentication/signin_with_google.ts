import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebaseMain";
import callHub from "../api/call_hub";
import errorAlert from "@/components/alerts/error";
import successAlert from "@/components/alerts/sucess";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const signInWithGoogle = async (
  nextRouter: AppRouterInstance,
  setIsLoading: (isLoading: boolean) => void
) => {
  //
  const provider = new GoogleAuthProvider();
  console.log("sign with Google called");

  //
  setIsLoading(true);
  try {
    // await signInWithPopup(auth, provider)
    //   .then(async (result) => {
    //     console.log("logged in", result);
    //     const idToken = await result.user.getIdToken();
    //     console.log("idtoken", idToken);
    //     console.log("otherToken", result.user);

    const response = await callHub("auth", { googleIdToken: true });
    console.log("response");

    if (response.status !== 200) {
      errorAlert("auth", "", "Email or Password incorrect");
      return;
    }
    successAlert("auth", response.message);
    const sessionId = response.sessionId;

    if (sessionId) {
      sessionStorage.setItem("sessionId", sessionId);
    }
    nextRouter.push("/home");
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  } catch (error) {
    console.error("Google Sign-In failed", error);
  } finally {
    setIsLoading(false);
  }
};
