import { sanitizeData, sanitizeFile } from "@/services/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    //
    console.log('request at POST sanitize');
    let postData: string | File;
    let response: { status: number, message: string } = { status: 0, message: "" };
    const contentType = req.headers.get('Content-Type') || '';

    try {
        if(contentType.includes("application/json")){
            postData = await req.json();
            console.log('postData at sanitize', postData);
            response = await sanitizeData(postData);
            
        } else {
            console.log('checking image at POST sanitize');
            const formData = await req.formData();
            const file = formData.get("file");

            if (!(file instanceof File)) {
                return NextResponse.json({ status: 400, message: "No file uploaded" });
            }
            
            postData = file;
            console.log("Received file:", postData.name, postData.type);
            response =  await sanitizeFile(postData);
        }
        // const response = await sanitizeData(postData);
        console.log('response at sanitize', response.message, response.status);
        console.log('Raw response from sanitizeData:', response);
        if(response.status === 200) return NextResponse.json({status: 200, message: response.message});
        else return NextResponse.json({status: 205, message: response.message, });
    } catch (error) {
    console.error(error);
    return NextResponse.json({status: 205, message: "error on url"});
    }
}
