import apiRoutes  from "../../../services/api/api_routes";
import { NextResponse } from "next/server";

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
                const getPostData = await req.json();
                postData = getPostData.data;
                type = getPostData.type;
            }else {
         ///-----------------------------------------------       
         /// For request including files.
         ///-----------------------------------------------   
            const formData = await req.formData();
         ///-----------------------------------------------
         /// Check the type of route the api will take from
         /// typeofAction (Post, Logout, Clean-File) for
         /// authentication the type of content is as json
         ///----------------------------------------------- 
            const typeOfAction = formData.get("type");
            switch(typeOfAction){
            ///#### POST (Save) 
            case "post":
                //Retrieve the authorization session token from the headers
                const session = req.headers.get("Authorization")?.split(" ")[1];
               
                if (session) {
                    formData.append("session", session);
                } else {
                    console.warn("Session is undefined, skipping formData append.");
                    return NextResponse.json({ status: 401, message: "User without a valid session" });
                }
                postData = formData;
                type = "post";
            break;
            ///### LOGOUT
            case "logout":
                //Retrieve the authorization session token from the headers
                const sessionIdForLougout = req.headers.get("Authorization")?.split(" ")[1];
                if (sessionIdForLougout) {
                    postData = sessionIdForLougout;
                } else {
                    return NextResponse.json({ status: 401, message: "User without a valid session" });
                }
                type = typeOfAction;
            break;
            ///### SANITIZE (clean-image).
            default:
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
            return NextResponse.json({ status: jsonResponse.status, message: "User authenticated", sessionId: sessionId });
        } else {
        return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {
        return NextResponse.json({status: 500, message: "Internal Server Error" + error });
    }
}