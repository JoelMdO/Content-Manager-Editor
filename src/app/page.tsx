"use client";
import { useState } from "react";
import callHub from "../services/api/call_hub";
import successAlert from "../components/alerts/sucess";
import errorAlert from "../components/alerts/error";
import LogoButton from "../components/buttons/logo_button";
import { useRouter } from "next/navigation";
import Loader from "../components/buttons/loader_saving";
import { signInWithGoogle } from "../services/authentication/signin_with_google";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const Login: React.FC = () => {
  ///===================================================
  // User Login UI
  ///===================================================
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  ///--------------------------------------------------------
  //handleLogin with Firebase authentication
  ///--------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    setIsSubmitted(true);
    e.preventDefault();
    const response = await callHub("auth", { email, password });

    if (response.status !== 200) {
      setIsSubmitted(false);
      errorAlert("auth", "", "Email or Password incorrect");
      return;
    }
    setIsSubmitted(false);
    successAlert("auth", response.message);
    const sessionId = response.sessionId;

    if (sessionId) {
      sessionStorage.setItem("sessionId", sessionId);
    }
    router.push("/home");
  };
  //
  //
  ///--------------------------------------------------------
  /// UI with a login form and a contact button for the
  /// user to reach the software engineer.
  ///--------------------------------------------------------
  return (
    <>
      <div className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16">
        <div className="absolute top-4 right-4">
          <LogoButton type="login" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <img
            src="/yourCMS.png"
            alt="CMS Title"
            className="w-52 h-52 md:w-[18rem] md:h-[15rem] mb-4"
          />
          <h1 className="text-2xl font-bold pb-4">Welcome!</h1>
          <form
            onSubmit={handleLogin}
            className="flex flex-col align-center items-center space-y-4 border-cyan-200 border-2 rounded-lg p-4 xs:w-[250px] md:w-[360px]"
          >
            <input
              className="w-[75%] flex align-center justify-center"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-[75%] flex align-center justify-center"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green text-white rounded-lg md:w-[170px] h-[30px] w-[120px] flex justify-center items-center"
            >
              {isSubmitted ? <Loader type="Logging..." /> : "Login"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="bg-blue-light text-white rounded-lg w-[33vw] h-[4.5vh] md:w-[9vw] md:h-[1.7vw] mt-5 flex justify-center items-center"
          >
            <div className="flex flex-row">
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="w-6 h-6 mr-2 rounded-xl"
                width={50}
                height={50}
              />
              Sign in
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
