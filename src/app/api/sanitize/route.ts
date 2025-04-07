import { sanitizeData, sanitizeFile } from "@/utils/dashboard/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
    ///----------------------------------------------------------------
    ///Endpoint to sanitize the content before heading to the editor
    ///----------------------------------------------------------------
    //
    let postData: string | File;
    let response: { status: number, message: string } = { status: 0, message: "" };
    const contentType = req.headers.get('Content-Type') || '';

    ///Based on the contentType received its able to determine if there is a
    ///file or not.
    try {
        if(contentType.includes("application/json")){
            postData = await req.json();
            response = await sanitizeData(postData, "link");
            
        } else {
            const formData = await req.formData();
            const file = formData.get("file");

            if (!(file instanceof File)) {
                return NextResponse.json({ status: 400, message: "No file uploaded" });
            }
            
            postData = file;
            response =  await sanitizeFile(postData);
        }
        if(response.status === 200) return NextResponse.json({status: 200, message: response.message});
        else return NextResponse.json({status: 205, message: response.message, });
    } catch (error) {
    return NextResponse.json({status: 205, message: "error on url"});
    }
}
