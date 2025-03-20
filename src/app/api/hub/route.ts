import { cookies } from "next/headers";
import apiRoutes  from "../../../services/api_routes";
import { NextResponse } from "next/server";
import forwardResponseWithCookie from "@/services/forward_cookie";
// import { supabase } from "../../../lib/supabase_client";
// import { url } from "inspector";
export async function POST(req: Request): Promise<any> {
    //
    let postData: string | File | {} = "";
    let type: string = "clean-image";
    const contentType = req.headers.get('Content-Type') || '';
    //
    //
    try {
            //### For non files only text as
            if (contentType.includes("application/json")){
                console.log('data is content type json');
                const getPostData = await req.json();
                postData = getPostData.data;
                type = getPostData.type;
                console.log('postData json at hub', postData);
            }else {
            //### For including files.
            console.log('file is going to be checked at post hub');
            const formData = await req.formData();
            const typeOfAction = formData.get("type");
            console.log('typeOfAction at api/hub', typeOfAction);

            //### POST the file.
            if (typeOfAction === "post"){
                console.log("Posting at hub POST");
                postData = formData;
                type = "post";
            //### LOGOUT
            } else if (typeOfAction === "logout"){
                console.log("to log out");
                postData = "";
                type = "logout";
            ///### CLEAN the file.
            } else {
            console.log('data is file image');
            const file = formData.get("file");
            if (!(file instanceof File)) {
                return NextResponse.json({ status: 400, message: "No file uploaded" });
            }
            postData = file;
            }}
            //
            // Get token from cookies
            const cookieStore = await cookies();
            const token = cookieStore.get("token")?.value;  
            const start = cookieStore.get("start")?.value;
            console.log('token at apiHub', token, 'start at apiHub', start);
        ///Send the file to the route Sanitize
        const response = await apiRoutes({data: postData, type: type});
        const jsonResponse = await response.json();
        console.log(`response at hub from ${type}`, {status: jsonResponse.status, message: jsonResponse.message});
        ///-----------------------------------------------------------------------------
        ///When the user has been authenticated, to forward the cookies. 
        ///-----------------------------------------------------------------------------
        if (jsonResponse.message === "User authenticated"){
            return forwardResponseWithCookie(jsonResponse);
        } else {
        return NextResponse.json({status: response.status, message: response.message});
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({status: 500, message: "Internal Server Error" + error });
    }
}