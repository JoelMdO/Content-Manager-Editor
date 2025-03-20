import { credential } from "firebase-admin";
import createFormData from "./create_formData";
import forwardResponseWithCookie from "./forward_cookie";

const callHub = async (type: string, data?: any) : Promise<any> => {
    console.log('data at call hub', data);
    console.log('type at call hub', type);
    let body: FormData | string = new FormData(); 
    let headers: HeadersInit = {};
    let credentials: RequestCredentials = "omit";
    //
    switch(type){
        case "clean-image": 
            body.append('file', data);
            body.append('type', type);
            break;
        case "post":
            const formData = await createFormData(type, data);
            console.log('formData after createFormData');
            body = formData;
            credentials = "include";
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
        console.log("response", response.ok, response.status, response.statusText);
        console.log('response at call hub before json', response);
        const jsonResponse = await response.json();
        console.log('response at call hub after json', {status: jsonResponse.status, message: jsonResponse.message});
        ///-----------------------------------------------------------------------------
        ///When the user has been authenticated, to forward the cookies. 
        ///-----------------------------------------------------------------------------
        if (jsonResponse.message === "User authenticated"){
            return forwardResponseWithCookie(jsonResponse);
        }
        return {status: jsonResponse.status, message: jsonResponse.message};
    } catch (error) {
    console.error(error);
    console.log('error at call hub', error);
    return {status: 500, message: error };
    }
}
export default callHub;