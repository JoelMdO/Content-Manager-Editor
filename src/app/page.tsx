"use client";
import { useState } from "react";
import successAlert from "../components/alerts/sucess";
import errorAlert from "../components/alerts/error";
import LogoButton from "../components/buttons/logo_button";
import { useRouter } from "next/navigation";
import Loader from "../components/buttons/loader_saving";
import Image from "next/image";
import { signIn } from "next-auth/react";
import callHub from "../services/api/call_hub";
import text from "../constants/mainPage_data_text.json";

const Login: React.FC = () => {
  ///===================================================
  // User Login UI
  ///===================================================
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showReset, setShowReset] = useState<boolean>(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmittedGoogle, setIsSubmittedGoogle] = useState<boolean>(false);
  const router = useRouter();
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

  const handleSendResetLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      errorAlert("auth", "", "Please enter your email to reset password");
      return;
    }
    setIsResetSubmitting(true);
    try {
      await callHub("password-reset", { email });
      // Always show generic message — never reveal if email exists
      successAlert(
        "auth",
        "If this email exists, a password reset link has been generated",
      );
      setShowReset(false);
    } catch {
      errorAlert("auth", "", "Could not send reset email. Try again.");
    } finally {
      setIsResetSubmitting(false);
    }
  };

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
              data-cy="email-input"
              className="w-[75%] flex align-center justify-center"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              data-cy="password-input"
              className="w-[75%] flex align-center justify-center"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              data-cy="login-button"
              type="submit"
              className="bg-green text-white rounded-lg md:w-[170px] h-[30px] w-[120px] flex justify-center items-center shadow-md shadow-dark-background"
            >
              {isSubmitted ? (
                <Loader type={`${text.mainPage.Logging}...`} />
              ) : (
                `${text.mainPage.login}`
              )}
            </button>
            <button
              type="button"
              data-cy="forgot-password-button"
              onClick={() => setShowReset((s) => !s)}
              className="text-sm underline mt-2 text-slate-700"
            >
              Forgot password?
            </button>
          </form>
          {showReset ? (
            <>
              <form
                onSubmit={handleSendResetLink}
                className="flex flex-col items-center space-y-3 mt-3"
              >
              <input
                data-cy="reset-email-input"
                className="w-[75%] flex align-center justify-center"
                type="email"
                placeholder="Type your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex space-x-2">
                <button
                  data-cy="send-reset-button"
                  type="submit"
                  className="bg-blue text-white text-xs rounded-lg md:w-[170px] h-[30px] w-[120px] flex justify-center items-center shadow-md shadow-dark-background"
                >
                  {isResetSubmitting ? (
                    <Loader type={`Sending...`} />
                  ) : (
                    `Send reset link`
                  )}
                </button>
                <button
                  type="button"
                  data-cy="reset-cancel-button"
                  onClick={() => setShowReset(false)}
                  className="bg-gray-200 rounded-lg text-xs md:w-[70px] h-[30px] w-[70px] flex justify-center items-center"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Signed in with Google? Manage your password at{" "}
              <a
                href="https://myaccount.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                myaccount.google.com
              </a>
              .
            </p>
            </>
          ) : null}
          <button
            type="button"
            data-cy="google-signin-button"
            onClick={() => {
              setIsSubmittedGoogle(true);
              signIn("google", { callbackUrl: "/home" });
            }}
            className="bg-blue-light text-white rounded-lg md:w-[170px] h-[30px] w-[120px] mt-5 flex justify-center items-center shadow-md shadow-dark-background"
          >
            <div className="flex flex-row">
              {isSubmittedGoogle ? null : (
                <img
                  src={process.env.NEXT_PUBLIC_GOOGLE_DEV_URL!}
                  alt="Google logo"
                  className="w-6 h-6 mr-2 rounded-xl"
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
