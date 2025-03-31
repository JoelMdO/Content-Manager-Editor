'use client'
import { useState } from "react";
import callHub from "../services/api/call_hub";
import successAlert from "../components/alerts/sucess";
import errorAlert from "../components/alerts/error";
import LogoButton from "../components/buttons/logo_button";

const Login: React.FC = () => {
    ///===================================================
    // User Login UI
    ///=================================================== 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //handleLogin with Firebase authentication
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await callHub("auth", {email, password});
        
        if (response.status !== 200) {
            errorAlert("auth", "", "Email or Password incorrect");
            return;
        }
        successAlert("auth", response.message);
        const sessionId = response.sessionId;
        
        sessionStorage.setItem("sessionId", sessionId);
        window.location.href = "/dashboard";
    };
    //
    ///--------------------------------------------------------
    /// UI with a login form and a contact button for the 
    /// user to reach the software engineer.
    ///--------------------------------------------------------
    return (
        <>
        <div className ="relative w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16">
        <div className="absolute top-4 right-4">
        <LogoButton/></div>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <img src="/yourCMS.png" alt="CMS Title" className="w-52 h-52 md:w-[18rem] md:h-[15rem] mb-4" />
            <h1 className="text-2xl font-bold pb-4">Welcome!</h1>
            <form onSubmit={handleLogin} className="flex flex-col align-center items-center space-y-4 border-cyan-200 border-2 rounded-lg p-4 xs:w-[250px] md:w-[360px]">
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
                <button type="submit" className="bg-green text-white rounded-lg md:w-[170px] h-[30px] w-[120px]">Login</button>
                
            </form>
        </div>
        </div>
    </>
    );
}

export default Login;