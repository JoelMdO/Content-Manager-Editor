import createFormData from "../../utils/images_edit/create_formData";

const callHub = async (type: string, data?: any) : Promise<any> => {
    ///=============================================================
    /// Function to orchestrate the api endpoints as hub.
    ///=============================================================
    let body: FormData | string = new FormData(); 
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    //
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
            const sessionId = sessionStorage.getItem('sessionId');
            console.log('sessionId', sessionId);
            
            headers = { ...headers, Authorization: `Bearer ${sessionId}` };
            body = formData;
            credentials = "include";
            break;
        //## LOGOUT
        case "logout":  
            body = JSON.stringify({data: "", type: type});
            const sessionIdForLougout = sessionStorage.getItem('sessionId');
            console.log('sessionIdForLougout', sessionIdForLougout);
            
            headers["Content-Type"] = "application/json";
            headers = { ...headers, Authorization: `Bearer ${sessionIdForLougout}` };
            break;
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
        ///-----------------------------------------------
        /// From api/auth return the sessionId.
        ///-----------------------------------------------
        if(jsonResponse.message === "User authenticated"){
            const sessionId = jsonResponse.sessionId;
            return { status: jsonResponse.status, message: "User authenticated", sessionId: sessionId };
        } else {
        return {status: jsonResponse.status, message: jsonResponse.message};
        }
    } catch (error) {
    return {status: 500, message: error };
    }
}
export default callHub;