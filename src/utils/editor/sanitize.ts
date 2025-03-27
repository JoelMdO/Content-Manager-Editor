'server-only';
import sanitizeHtml from 'sanitize-html';

export async function sanitizeData(data: any) : Promise<{ status: number, message: string }> {
    ///========================================================
    // Function to sanitize the links
    ///========================================================
    let sanitizedData: { status: number, message: string } = { status: 0, message: "" };
    let value: string = "";

        if (typeof data === 'string') {
            value = sanitizeHtml(data);
            // Check if the string is a URL
            if (isValidUrl(value)) {
                sanitizedData = sanitizeUrl(value);
            } else {
                sanitizedData = {status: 205, message: "url not allowed"};
        }} else {
           //is not a string return error. 
            sanitizedData = {status: 205, message: "url not allowed"};
        }
    return sanitizedData;
}

// Helper to validate URL
function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        if (url.protocol === "https:") return true;
        else return false;
    } catch (error) {
        return false;
    }
}

// Sanitize URLs (avoid JavaScript URLs)
function sanitizeUrl(url: string): { status: number; message: string } {
    if(url.startsWith("javascript:")) return {status: 205, message: "url not allowed"};
    if(url.includes("javascript:") || url.includes("data:")|| url.includes("<script>")) return {status: 205, message: "url not allowed"};
    else return {status: 200, message: "url valid"};
}

// Sanitize file uploads
export async function sanitizeFile(file: File): Promise<{ status: number; message: string }> {
    ///========================================================
    // Function to sanitize the images.
    ///========================================================
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    const maxSize = 500 * 1024; // 5kB limit
    try{
    if (!allowedTypes.includes(file.type)) {
        console.error("Invalid file type");
        return {status: 205, message: "Invalid file type"};
    }
    if (file.size > maxSize) {
        console.error("File too large");
        return {status: 205, message: "File too large"};
    }
     // Sanitize the filename (avoid script injection via filename)
    const sanitizedFileName = sanitizeHtml(file.name, {
        allowedTags: [],
        allowedAttributes: {},
    });

    if (sanitizedFileName !== file.name) {
        console.error("File name contains suspicious characters");
        return { status: 400, message: "Invalid file name" };
    }

    // Ensure it's a valid image by reading its bytes
        const buffer = await file.arrayBuffer(); // Convert File to binary data
        const uint8Array = new Uint8Array(buffer);

        // Basic check: Make sure the file starts with valid image headers
        if (!isValidImage(uint8Array)) {
            return { status: 400, message: "Invalid image content" };
        }
    } catch (error) {
        return { status: 500, message: "Error processing file" };
    }

    return { status: 200, message: "File valid" };
}

// Function to check valid image file headers (magic numbers)
function isValidImage(bytes: Uint8Array): boolean {
    const pngHeader = [0x89, 0x50, 0x4E, 0x47]; // PNG: 89 50 4E 47
    const jpegHeader = [0xFF, 0xD8, 0xFF]; // JPEG: FF D8 FF
    const gifHeader = [0x47, 0x49, 0x46, 0x38]; // GIF: 47 49 46 38

    return (
        startsWith(bytes, pngHeader) ||
        startsWith(bytes, jpegHeader) ||
        startsWith(bytes, gifHeader)
    );
}

// Utility function to check if bytes start with a given signature
function startsWith(bytes: Uint8Array, signature: number[]): boolean {
    return signature.every((byte, index) => bytes[index] === byte);
}
