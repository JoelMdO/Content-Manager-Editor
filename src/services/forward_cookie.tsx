import { NextResponse } from "next/server";

const forwardResponseWithCookie = async (jsonResponse: any) => {
    console.log("jsonResponse at forwardResponseWithCookie", jsonResponse);
    const nextResponse = NextResponse.json(jsonResponse, { status: jsonResponse.status });
            const setCookieHeader = jsonResponse.headers.get("set-cookie");
            console.log("setCookieHeader", setCookieHeader);
            if (setCookieHeader) {
                nextResponse.headers.set("set-cookie", setCookieHeader); // Forward cookies
                console.log("nextrsponse after set cookie", nextResponse);
            } else {
            return {status: jsonResponse.status, message: jsonResponse.message};
}}

export default forwardResponseWithCookie;