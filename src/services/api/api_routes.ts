'server-only';
import { NextResponse } from "next/server";
import sessionCheck from "../authentication/session_check";

const apiRoutes = async (postData: any): Promise<any> => {
    ///=============================================================
    /// Function to redirect the api endpoints, includes the fecthing
    ///=============================================================
    const {data, type} = postData;  
    const url = process.env.NEXT_PUBLIC_url_api; //TODO change env file with url on deployment.
    let endPoint: string = "";
    let body: string | FormData = new FormData();
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    let sessionId: string = "";
    //
    try{
    ///-----------------------------------------------
    /// Api endpoints, per type.
    ///-----------------------------------------------
    console.log('type at apiRoutes', type);
    console.log('data at apiRouotes', data);
    
    
    
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
            sessionId = data.get("session");
            const response = await sessionCheck(sessionId);
                console.log("authJson after reauthenticate at apiRoutes", response)
                if (response.status !== 200) {
                    return NextResponse.json({ status: 401, message: "Reauthentication failed" });
                }
            ///-----------------------------------------------
            /// Check if data is already FormData
            ///-----------------------------------------------
                if (data instanceof FormData) {
                    data.append('userId', response.user!); 
                    data.delete('session'); 
                    body=data;
                } else {
                    // Convert data to FormData if it's not already
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
            ///-----------------------------------------------
            /// Verify sessionId if its valid through the sessionCheck function
            ///-----------------------------------------------
            sessionId = data;
            const responseSessionCheck = await sessionCheck(sessionId);
            const auth = {user: responseSessionCheck.user!, sessionId: sessionId};
            body = JSON.stringify(auth);
            headers["Content-Type"] = "application/json";
            credentials = "include";
        break;
        case "playbook-save":
            endPoint = "save";
            console.log('calling save');
            ///-----------------------------------------------
            /// Verify sessionId if its valid through the sessionCheck function
            ///-----------------------------------------------
            sessionId = data.sessionId;
            console.log('sessionID at apiRoutes playbook', sessionId);
            const responsePlay = await sessionCheck(sessionId);
                console.log("authJson after reauthenticate at apiRoutes", responsePlay)
                if (responsePlay.status !== 200) {
                    console.log('response not 200 playbook');
                    return NextResponse.json({ status: 401, message: "Reauthentication failed" });
                }
            console.log('doing the rest of playbook after 200 ok');
            
            body = JSON.stringify(data.data);
            headers["Content-Type"] = "application/json";
            credentials = "include";
            break;
            case "playbook-search":
            case "playbook-search-bar":
            case "playbook-search-category":    
                endPoint = "search";
                console.log('calling search');
                ///-----------------------------------------------
                /// Verify sessionId if its valid through the sessionCheck function
                ///-----------------------------------------------
                sessionId = data.sessionId;
                console.log('sessionID at apiRoutes playbook search', sessionId);
                const responsePlaySearch = await sessionCheck(sessionId);
                    console.log("authJson after reauthenticate at apiRoutes", responsePlaySearch)
                    if (responsePlaySearch.status !== 200) {
                        console.log('response not 200 playbook');
                        return NextResponse.json({ status: 401, message: "Reauthentication failed" });
                    }
                console.log('doing the rest of playbook after 200 ok');
                
                body = JSON.stringify(postData);
                headers["Content-Type"] = "application/json";
                credentials = "include";
                break;
        default:
            return {status: 205, message: "type not found"};
    }
    ///-----------------------------------------------
    /// Call the corresponding API endpoint
    ///-----------------------------------------------
        console.log('calling endpoint', endPoint);
        
        console.log('calling endpoint', endPoint);
        
        const response = await fetch(`${url}/api/${endPoint}`, {
            method: 'POST',
            body: body,
            headers: headers,
            credentials: credentials
        });
        // Wait for the JSON response
        const jsonResponse = await response.json();
        console.log('jsonResponse at apiRpiutes', jsonResponse);
        
        ///-----------------------------------------------
        /// From api/auth return the sessionId.
        ///-----------------------------------------------
        if(jsonResponse.message === "User authenticated"){
            const sessionId = jsonResponse.session;
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
            console.log('doing data search and found');
            
        const body = jsonResponse.body;
        return NextResponse.json({ status: jsonResponse.status, message: "Data found successfully", body: body });
        } else {
        return NextResponse.json({status: jsonResponse.status, message: jsonResponse.message});
        }
    } catch (error) {    
    return {status: 500, message: "error" + error, };
    }
} 

export default apiRoutes;