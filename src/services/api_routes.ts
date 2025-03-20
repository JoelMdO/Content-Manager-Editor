'server-only';
import {cookies} from "next/headers";
import { NextResponse } from "next/server";
import forwardResponseWithCookie from "./forward_cookie";

const apiRoutes = async (postData: any): Promise<any> => {
    const {data, type} = postData;  
    console.log('data at apiRoutes', data, 'type at apiRoutes', type);

    const url = process.env.NEXT_PUBLIC_url_api; //TODO change env file with url on deployment.
    let endPoint: string = "";
    let body: string | FormData = new FormData();
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    // const cookie = await cookies();
    // console.log("cookies at api routes", cookie.getAll());
    //
    try{
    switch(type){
        case "clean-link":
            endPoint = "sanitize";
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        break;
        case "clean-image":
            endPoint = "sanitize";
            body.append('file', data);
        break;
        case "post":
            endPoint = type;
            // Get token from cookies
            const cookieStore = await cookies();
            let token = cookieStore.get("token")?.value;
            const start = cookieStore.get("start")?.value;
            console.log('token at apiRoutes', token, 'start at apiRoutes', start);
            if (!token) {
                console.log("Token missing, reauthenticating...");
                const authResponse = await fetch(`${url}/api/auth`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reauth: true }), // Pass a flag to reauthenticate
                    credentials: "include", // Include cookies in the request
                });
                console.log("authResponse at apiRoutes", authResponse)
                const authJson = await authResponse.json();
                console.log("authJson after reauthenticate at apiRoutes", authJson)
                if (authJson.status !== 200) {
                    return NextResponse.json({ status: 401, message: "Reauthentication failed" });
                }
                const userId = authJson.message;
                body.append('userId', userId!);
                console.log("Reauthenticated, new userId:", userId);
            }
                // return NextResponse.json({
            //     status: 401,
            //     message: "Authentication required"
            // }, { status: 401 });
                if (data instanceof FormData) {
                    console.log('data is formdata');
                    body = data;
                } else {
                    // Convert data to FormData if it's not already
                    console.log('data is not formdata');
                    body = new FormData();
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            body.append(key, data[key]);
                        }
                    }
                }
            credentials = "include";
        break;
        case "auth":
            endPoint = "auth";
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
            credentials = "include";
        break;
        case "logout":
            endPoint = "logout";
            body = "";
            headers["Content-Type"] = "application/json";
            credentials = "include";
        break;      
        default:
            console.log('type not found');
            return {status: 205, message: "type not found"};
    }
    // Call the API
        console.log(`called ${endPoint}`);
        console.log('headers', headers);
        const response = await fetch(`${url}/api/${endPoint}`, {
            method: 'POST',
            body: body,
            headers: headers,
            credentials: credentials
        });
        // Wait for the JSON response
        const jsonResponse = await response.json();
        console.log(`response at api routes from ${type}`, {status: jsonResponse.status, message: jsonResponse.message});
        ///-----------------------------------------------------------------------------
        ///When the user has been authenticated, to forward the cookies. 
        ///-----------------------------------------------------------------------------
        if (jsonResponse.message === "User authenticated"){
            return forwardResponseWithCookie(jsonResponse);
        } else {
            return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {    
    console.error(error);
    return {status: 500, message: "error" + error, };
    }
} 

export default apiRoutes;