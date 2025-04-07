import errorAlert from "@/components/alerts/error";
import createFormData from "../../utils/images_edit/create_formData";

const callHub = async (type: string, data?: any) : Promise<{status: number, message: any, sessionId?: string, body?: any}> => {
    ///=============================================================
    /// Function to orchestrate the api endpoints as hub.
    ///=============================================================
    let body: FormData | string = new FormData(); 
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    let sessionId: string | null = "";
    //
    console.log('called callHub');
    
    ///-----------------------------------------------
    /// Build the body of the request as each one it has
    /// different structure. 
    //  Once done it will redirect to the hub.
    ///-----------------------------------------------
    switch(type){
        ///## SANITIZE IMAGE
        case "clean-image": 
            body.append('file', data);
            body.append('type', type);
            break;
        //## POST
        case "post":
            const formData = await createFormData(type, data);
            sessionId = sessionStorage.getItem('sessionId');
            sessionId = sessionStorage.getItem('sessionId');
            headers = { ...headers, Authorization: `Bearer ${sessionId}` };
            body = formData;
            credentials = "include";
            break;
        //## LOGOUT
        case "logout":  
            body = JSON.stringify({data: "", type: type});
            sessionId = sessionStorage.getItem('sessionId');
            sessionId = sessionStorage.getItem('sessionId');
            sessionStorage.removeItem('sessionId');
            headers["Content-Type"] = "application/json";
            headers = { ...headers, Authorization: `Bearer ${sessionId}` };
            break;
        //## PLAYBOOK SAVE
        case "playbook-save":
            console.log('called playbook-save from callHub');
            body = JSON.stringify({data: data, type: type});
            sessionId = sessionStorage.getItem('sessionId');
            headers["Content-Type"] = "application/json";
            headers = { ...headers, Authorization: `Bearer ${sessionId}` };
            credentials = "include";
        default:
            body = JSON.stringify({data: data, type: type});
            headers["Content-Type"] = "application/json";
            break;
    }
    //
    try{
    const response = await fetch('api/hub', {
        method: 'POST',
        body: body,
        headers: headers,
        credentials: credentials
    });
        const jsonResponse = await response.json();
        console.log('jsonResponse at callHub', jsonResponse);
        
        ///-----------------------------------------------
        /// From api/auth return the sessionId.
        ///-----------------------------------------------
        if(jsonResponse.message === "User authenticated"){
            console.log('doing ok auth');
            
            const sessionId = jsonResponse.sessionId;
            return { status: jsonResponse.status, message: "User authenticated", sessionId: sessionId };
        ///-----------------------------------------------
        /// From api/post returzzn the body.
        ///-----------------------------------------------
        }else if (jsonResponse.message === "Data saved successfully"){
            const body = jsonResponse.body;
            return { status: jsonResponse.status, message: "Data saved successfully", body: body };
        ///-----------------------------------------------
        /// From api/search return the meta.
        ///-----------------------------------------------
        }else if (jsonResponse.message === "Data found successfully"){
        const body = jsonResponse.body;
        return { status: jsonResponse.status, message: "Data found successfully", body: body };
        ///--------------------------------------------------------
        // When the user is not longer authenticated
        ///--------------------------------------------------------
        } else if (jsonResponse.message === "User not authenticated" || jsonResponse.message === "'Failed to refresh token" || jsonResponse.message === "Reauthentication failed") {   
         return {status: 401, message: jsonResponse.message};
        } else {
        return {status: jsonResponse.status, message: jsonResponse.message};
        }
    } catch (error) {
  return {status: 500, message: error };
    }
}
export default callHub;