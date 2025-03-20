import "server-only";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; 
import admin from "firebase-admin";


export const authenticateUser = async (token: string): Promise<{ status: number; message: string; userId?: string }> => {

    const cookiesAuth = await cookies();
    // Check if user is signed in via cookie
    // const isSignedIn = cookiesAuth.get("start")?.value;
    // console.log("Cookies at setAuthListener:", isSignedIn);  // Log cookie value
    // console.log("see all cookies", cookiesAuth.getAll());
    
    // //
    // if (!isSignedIn) {
    //     console.error("🚨 User is not signed in.");
    //     return {status: 400, message: "User is not signed in."};
    // }
    // Check if Token still valid
    // console.log("user signed in", isSignedIn, "token", localStorage.getItem("token"));
    // const token = cookiesAuth.get("token")?.value;
    console.log("token at auth listener", token)
    if (!token) {
        console.error("🚨 Token is missing.");
        return { status: 401, message: "User not authenticated. Token is missing." };
    } else {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;
    if (userId){
        console.log("userID = yes");
        return {status: 200, message: userId};
    } else {
    // Refresh token
    console.log("Refreshing token");
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Get fresh token
                const newToken = await user.getIdToken(true);
                const decodedToken = await admin.auth().verifyIdToken(newToken);
                const userId = decodedToken.uid;
                if (userId){
                    resolve({status: 200, message: userId});
                }
            } catch (error) {
                console.error("Failed to refresh token:", error);
                reject({status: 400, message: `Failed to refresh token ${error}`})
            }
        }
    });
})};}};