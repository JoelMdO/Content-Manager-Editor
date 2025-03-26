'server-only';
import { NextResponse } from "next/server";
import sessionCheck from "./authentication/session_check";

const apiRoutes = async (postData: any): Promise<any> => {
    const {data, type} = postData;  
    console.log('data at apiRoutes', data, 'type at apiRoutes', type);

    const url = process.env.NEXT_PUBLIC_url_api; //TODO change env file with url on deployment.
    let endPoint: string = "";
    let body: string | FormData = new FormData();
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    //
    try{
    switch(type){
        //## SANITIZE LINK
        case "clean-link":
            endPoint = "sanitize";
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        break;
        //## SANITIZE IMAGE
        case "clean-image":
            endPoint = "sanitize";
            body.append('file', data);
        break;
        //## POST
        case "post":
            endPoint = type;
            ///-----------------------------------------------
            /// Verify sessionId if its valid through the sessionCheck function
            ///-----------------------------------------------
            const sessionId = data.get("session");
            console.log("session at apiRoutes", sessionId);
            const response = await sessionCheck(sessionId);
                console.log("authJson after reauthenticate at apiRoutes", response)
                if (response.status !== 200) {
                    return NextResponse.json({ status: 401, message: "Reauthentication failed" });
                }
                console.log("Reauthenticated, new userId:", response.user!);
            ///-----------------------------------------------
            /// Check if data is already FormData
            ///-----------------------------------------------
                if (data instanceof FormData) {
                    console.log('data is formdata');
                    data.append('userId', response.user!);
                    data.delete('session');
                    body=data;
                } else {
                    // Convert data to FormData if it's not already
                    console.log('data is not formdata');
                    body = new FormData();
                    for (const key in data) {
                        if (data.hasOwnProperty(key && key != "session")) {
                            body.append(key, data[key]);
                        }
                        body.append('userId', response.user!);
                    }
                }
            credentials = "include";
        break;
        //## AUTH
        case "auth":
            endPoint = "auth";
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
            credentials = "include";
        break;
        //## LOGOUT
        case "logout":
            endPoint = "logout";
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
            credentials = "include";
        break;      
        default:
            console.log('type not found');
            return {status: 205, message: "type not found"};
    }
    ///-----------------------------------------------
    /// Call the API
    ///-----------------------------------------------
        console.log(`called ${endPoint}`);
        console.log('headers', headers);
        console.log('endpoint', `${url}/api/${endPoint}`);
        const response = await fetch(`${url}/api/${endPoint}`, {
            method: 'POST',
            body: body,
            headers: headers,
            credentials: credentials
        });
        console.log("response at apiRoutes before json", response);
        // Wait for the JSON response
        const jsonResponse = await response.json();
        ///-----------------------------------------------
        /// From api/auth return the sessionId.
        ///-----------------------------------------------
        console.log("jsonResponse at apiRoutes", jsonResponse);
        if(jsonResponse.message === "User authenticated"){
            const sessionId = jsonResponse.session;
            console.log("Authenticated sessionId:", sessionId);
            return NextResponse.json({ status: jsonResponse.status, message: "User authenticated", sessionId: sessionId });
        } else {
        console.log(`response at api routes from ${type}`, {status: jsonResponse.status, message: jsonResponse.message});
        return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {    
    console.error(error);
    return {status: 500, message: "error" + error, };
    }
} 

export default apiRoutes;