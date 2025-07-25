"use client";
import { useState } from "react";

import successAlert from "../components/alerts/sucess";
import errorAlert from "../components/alerts/error";
import LogoButton from "../components/buttons/logo_button";
import { useRouter } from "next/navigation";
import Loader from "../components/buttons/loader_saving";
import Image from "next/image";
import { signIn } from "next-auth/react";
import text from "../constants/mainPage_data_text.json";
import Home from "./home/page";

const Login: React.FC = () => {
  ///===================================================
  // User Login UI
  ///===================================================
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmittedGoogle, setIsSubmittedGoogle] = useState<boolean>(false);
  const router = useRouter();
  const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "development";
  ///--------------------------------------------------------
  //handleLogin with Firebase authentication
  ///--------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    setIsSubmitted(true);
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/home",
    });

    if (!result?.ok) {
      setIsSubmitted(false);
      errorAlert("auth", "", "Email or Password incorrect");
      return;
    }

    setIsSubmitted(false);
    successAlert("auth", "User authenticated");
    router.push("/home");
  };
  //

  ///--------------------------------------------------------
  /// UI with a login form and a contact button for the
  /// user to reach the software engineer.
  ///--------------------------------------------------------
  // //TODO dont delete on test only on production
  // if (isDev) {
  //   //Directly render dashboard for development
  //   return <Home />;
  // }
  return (
    <>
      <div className="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16">
        <div className="absolute top-4 right-4">
          <LogoButton type="login" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Image
            src="/yourCMS.svg"
            alt="CMS Title"
            width={52}
            height={52}
            quality={100}
            className="md:w-[18rem] md:h-[15rem] mb-4"
          />
          <h1 className="text-2xl font-bold pb-4">{text.mainPage.welcome}</h1>
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
              className="bg-green text-white rounded-lg md:w-[170px] h-[30px] w-[120px] flex justify-center items-center shadow-md shadow-dark-background"
            >
              {isSubmitted ? (
                <Loader type={`${text.mainPage.Logging}...`} />
              ) : (
                `${text.mainPage.login}`
              )}
            </button>
          </form>
          <button
            type="button"
            data-testid="google-login-button"
            onClick={() => {
              setIsSubmittedGoogle(true);
              signIn("google", { callbackUrl: "/home" });
            }}
            className="bg-blue-light text-white rounded-lg md:w-[170px] h-[30px] w-[120px] mt-5 flex justify-center items-center shadow-md shadow-dark-background"
          >
            <div className="flex flex-row">
              {isSubmittedGoogle ? null : (
                <Image
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-6 h-6 mr-2 rounded-xl"
                  width={50}
                  height={50}
                />
              )}
            </div>
            {isSubmittedGoogle ? (
              <Loader type={`${text.mainPage.Logging}...`} />
            ) : (
              `${text.mainPage.singin}`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
