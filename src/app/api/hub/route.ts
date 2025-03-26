import apiRoutes  from "../../../services/api/api_routes";
import { NextResponse } from "next/server";
// import { supabase } from "../../../lib/supabase_client";
export async function POST(req: Request): Promise<any> {
    //
    let postData: string | File | {} = "";
    let type: string = "clean-image";
    const contentType = req.headers.get('Content-Type') || '';
    //
    //
    try {
        ///-----------------------------------------------
        /// Check the content type to see if the request 
        /// comes without files only text
        ///-----------------------------------------------    
            if (contentType.includes("application/json")){
                console.log('request does not include files');
                const getPostData = await req.json();
                postData = getPostData.data;
                type = getPostData.type;
                console.log('postData json at hub', postData);
            }else {
         ///-----------------------------------------------       
         /// For request including files.
         ///-----------------------------------------------   
            console.log('request including files.');
            const formData = await req.formData();
         ///-----------------------------------------------
         /// Check the type of route the api will take from
         /// typeofAction (Post, Logout, Clean-File) for
         /// authentication the type of content is as json
         ///----------------------------------------------- 
            const typeOfAction = formData.get("type");
            console.log('typeOfAction at api/hub', typeOfAction);
            switch(typeOfAction){
            ///#### POST (Save) 
            case "post":
                console.log("Posting at hub POST");
                //Retrieve the authorization session token from the headers
                const session = req.headers.get("Authorization")?.split(" ")[1];
                console.log("session at hub/POST", session);
                if (session) {
                    formData.append("session", session);
                } else {
                    console.warn("Session is undefined, skipping formData append.");
                    return NextResponse.json({ status: 401, message: "User without a valid session" });
                }
                postData = formData;
                type = "post";
            break;
            ///### SANITIZE (clean-image).
            default:
            console.log('data is file image');
            const file = formData.get("file");
            if (!(file instanceof File)) {
                return NextResponse.json({ status: 400, message: "No file uploaded" });
            }
            postData = file;
            type = "clean-image";
            break;
            }}
        ///-----------------------------------------------
        /// Redirect the request to the apiRoutes endpoints
        ///-----------------------------------------------
        const response = await apiRoutes({data: postData, type: type});
        const jsonResponse = await response.json();
        ///-----------------------------------------------
        /// Response from api/auth return the sessionId.
        ///-----------------------------------------------
        if(jsonResponse.message === "User authenticated"){
            const sessionId = jsonResponse.sessionId;
            console.log("Authenticated sessionId:", sessionId);
            return NextResponse.json({ status: jsonResponse.status, message: "User authenticated", sessionId: sessionId });
        } else {
        console.log(`response at hub from ${type}`, {status: jsonResponse.status, message: jsonResponse.message});
        return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({status: 500, message: "Internal Server Error" + error });
    }
}