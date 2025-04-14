import apiRoutes  from "../../../services/api/api_routes";
import { NextResponse } from "next/server";
import { sanitizeData } from "../../../utils/dashboard/sanitize";

export async function POST(req: Request): Promise<any> {
    //
    let postData: string | File | {} = "";
    let type: string = "clean-image";
    const contentType = req.headers.get('Content-Type') || '';
    let sessionId: string = "";
    //
    console.log('api/hub at POST');
    
    //
    try {
        ///-----------------------------------------------
        /// Check the content type to see if the request 
        /// comes without files only text
        ///-----------------------------------------------    
            if (contentType.includes("application/json")){
                console.log('called contentType application/ api/bub');
                
                const getPostData = await req.json();
                postData = getPostData.data;
                type = getPostData.type;
                const typeSanitizeResponse = sanitizeData(type, "text");
                if((await typeSanitizeResponse).status != 200){
                    return NextResponse.json({ status: 403, message: "Unauthorized" });
                }
                console.log('type', type);
 
                switch(type){
                    ///### LOGOUT
                    case "logout":
                        console.log('called logout at api/hub POST');
                        
                        //Retrieve the authorization session token from the headers
                        sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
                        console.log('sessionIdForLogout', sessionId);
                        
                        if (sessionId) {
                            postData = sessionId;
                        } else {
         
                            return NextResponse.json({ status: 401, message: "User without a valid session" });
                        }
                        type = type;
                    break;
                    case "playbook-save":
                        console.log('called playbook_saved at api/hub POST');
                        
                        //Retrieve the authorization session token from the headers
                        sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
                        console.log('sessionI for playbook', sessionId);
                        
                        if (sessionId) {
                            postData = {sessionId: sessionId, data: postData};
                        } else {
         
                            return NextResponse.json({ status: 401, message: "User without a valid session" });
                        }
                        type = type;
                    break;
                    case "playbook-search":
                    case "playbook-search-bar":
                    case "playbook-search-category":
                        console.log('called playbook_search at api/hub POST');
                        //Retrieve the authorization session token from the headers
                        sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
                        console.log('sessionI for playbook', sessionId);
                        
                        if (sessionId) {
                            // Sanitize data.
                            let dataToSanitize: string | Object;
                            if(type === "playbook-search"){
                                dataToSanitize = type;
                            } else {
                                dataToSanitize = postData;
                            }    
                            const dataSanitizeResponse = sanitizeData(dataToSanitize, "text");
                                if((await dataSanitizeResponse).status != 200){
                                return NextResponse.json({ status: 403, message: "Unauthorized" });
                            }
                            if(type === "playbook-search"){
                                postData = {sessionId: sessionId, data: "", type: type};
                            } else {
                                postData = {sessionId: sessionId, data: postData, type: type};
                            }
                            } else {
                            return NextResponse.json({ status: 401, message: "User without a valid session" });
                        }
                        type = type;
                        postData = postData;
                    break;
                    default:
                        postData = postData;
                        type = type;
                    break;
                }
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
            const typeSanitizeResponse = sanitizeData(typeOfAction, "text");
                if((await typeSanitizeResponse).status != 200){
                    return NextResponse.json({ status: 403, message: "Unauthorized" });
                }
            switch(typeOfAction){
            ///#### POST (Save) 
            case "post":
                //Retrieve the authorization session token from the headers
                const session = req.headers.get("Authorization")?.split(" ")[1];
                
                if (session) {
                    formData.append("session", session);
                } else {
                    return NextResponse.json({ status: 401, message: "User without a valid session" });
                }
                /// Sanitize the data
                const responseAfterSanitize = sanitizeData(formData, "post"); 
                if ((await responseAfterSanitize).status === 200) {       
                postData = formData;
                type = "post";
                } else {
                return NextResponse.json({ status: 401, message: "Not valid data" });
                }
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
        ///-----------------------------------------------
        /// From api/post return the body.
        ///-----------------------------------------------
        }else if (jsonResponse.message === "Data saved successfully"){
            const body = jsonResponse.body;
            return NextResponse.json({ status: jsonResponse.status, message: "Data saved successfully", body: body });
        ///-----------------------------------------------
        /// From api/search return the meta.
        ///-----------------------------------------------
        }else if (jsonResponse.message === "Data found successfully"){
        const body = jsonResponse.body;
        return NextResponse.json({ status: jsonResponse.status, message: "Data found successfully", body: body });
        } else {
        return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {
        return NextResponse.json({status: 500, message: "Internal Server Error" + error });
    }
}