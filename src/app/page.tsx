'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import callHub from "@/services/call_hub";
import successAlert from "@/components/alerts/sucess";
import errorAlert from "@/components/alerts/error";

const Login: React.FC = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await callHub("auth", {email, password});
        
        if (response.status !== 200) {
            errorAlert("auth", "", "Email or Password incorrect");
            return;
        }
        successAlert("auth", response.message);
        const sessionId = response.sessionId;
        console.log("sessionId at log page", sessionId);
        sessionStorage.setItem("sessionId", sessionId);
        window.location.href = "/dashboard";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold pb-4">Welcome!</h1>
            <form onSubmit={handleLogin} className="flex flex-col align-center items-center space-y-4 border-cyan-200 border-2 rounded-lg p-4 w-[360px]">
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
                <button type="submit" className="bg-green text-white rounded-lg w-[170px] h-[30px]">Login</button>
            </form>
        </div>
    );
}

export default Login;