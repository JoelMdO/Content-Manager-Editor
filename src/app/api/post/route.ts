import { database } from "../../../../firebase";
import { ref, update } from "firebase/database";
import { NextResponse } from "next/server";
// import { supabase } from "../../../lib/supabase_client";
import cloudinary from "@/lib/cloudinary/cloudinary";

export async function POST(req: Request): Promise<Response> {
    //
    console.log('At api post');
    // Array to store image URLs
    const imageUrls: { url: string }[] = [];
    const formData = await req.formData();
    console.log('formData at api post', formData);
    //
    console.log("project_id", process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_project_id);
    interface Article{
        id: string;
        title: string;
        article: string;
        italic: string[];
        bold: string[];
        images?: {url: string}[];
    };
    //
    // Upload images and update URLs
    try{
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================
        let pre_images: Array<File> = [];
        let article: Article = {id: "", title: "", article: "", italic: [], bold: [], images: []};
        const imageFiles: File[] = [];
        let fileName: string = "";
        
        for (const key of formData.keys()) {
            if (key.startsWith("image")) {
                console.log("Found image file:", key);
                const fileData = formData.get(key);
                if (fileData instanceof Blob) { 
                    fileName = fileData.name || key;
                    // Convert to File
                    const file = new File([fileData], fileName, { type: fileData.type });
                    imageFiles.push(file);
                    console.log("Image converted to File:", file);
                } else {
                    const fileData = formData.get(key);
                    imageFiles.push(fileData as File);
                    console.warn("⚠️ Retrieved data is not a Blob:", fileData);
                } 
            }
        }
        console.log('imageFiles:', imageFiles);
        console.log("imageFiles at api/hub:", imageFiles.length);
        /// SUPABASE AUTHENTICATION
        // let user: any = await supabase.auth.getUser();
        // userKey = user.id;

        if(imageFiles.length > 0){
            console.log('Images detected, preparing for Supabase upload...');
            ///TODO Check if authorized to upload images
            // if (!user.data.user) {
            console.log("User not authenticated. Refreshing session...");
            //Filter valid file objects
                pre_images = imageFiles.filter((value): value is File => value instanceof File);
                console.log('pre_images', pre_images.length);
                console.log("🔄 Uploading images to Cloudinary...");

            await Promise.all(pre_images.map(async (item: File) => {
                return new Promise<void>(async (resolve, reject) => {
                    console.log('doing the promise at Image upload');
                    ///CLOUDINARY UPLOAD
                     //Convert to a buffer stream
                    const fileBuffer = await item.arrayBuffer();
                    const mimeType = item.type;
                    const encoding = "base64";
                    const base64Data = Buffer.from(fileBuffer).toString("base64");
                    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
                    const uploadStream = cloudinary.uploader.upload(fileUri, {
                        invalidate: true,
                        resource_type: "auto",
                        filename_override: fileName,
                        folder: "DeCav", 
                        use_filename: true,
                        },
                        (uploadError, result) => {
                    ///SUPABASE UPLOAD
                    // const filePath = `uploads/${formattedDate}_${item.name}`;
                    // Upload file to storage
                    // const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, item);
                    // console.log('error at supabase', uploadError);
                        if (uploadError){
                            // Handle upload error
                            console.error('Error uploading image:', uploadError.message);
                            return NextResponse.json({ status: 500, message: "Error uploading image. No URL." });
                        }
                            // Get public URL
                        if(result?.secure_url){
                            console.log('getting the url');
                    // SUPABASE URL
                    //     const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
                    //     console.log('publicUrlOf the Image', publicUrlData);
                    //     imageUrls.push({ url: publicUrlData?.publicUrl });
                    //     console.log('Public Image URL:', publicUrlData.publicUrl);
                    // CLOUDINARY URL
                        let urlCloudinary : string | undefined = "";
                        urlCloudinary = (result?.secure_url); 
                        console.log("urlCloudinary", urlCloudinary);
                        imageUrls.push({ url: urlCloudinary! });
                        }
                        resolve();
                        // uploadStream.end(buffer);
                        })//     // Update image URL in article content   
                        // If any images were uploaded, update the article's images array
                        if (imageUrls.length > 0) {
                            article.images = imageUrls;  // Append image URLs to article.images
                            console.log('Article images updated:', article.images);
                        }})}));
        }
        ///================================================================
        /// SAVE　THE FULL ARTICLE to database:
        ///================================================================
        const userId = formData.get("userId");
        console.log("userId at api POST", userId);
        const dbRef = ref(database, `articles/${userId}`);
        console.log("Database Path:", dbRef.toString());    
        // Parse individual fields
        const titleData = formData.get("title") as string;
        console.log('titleData', titleData);
        const titleObj = JSON.parse(titleData);
        console.log('titleObj', titleObj);
        const titleContent = titleObj.content;
        console.log('titleContent', titleContent);

        const idData = formData.get("id") as string;
        const idObj = JSON.parse(idData);
        const idContent = idObj.content; 

        const articleData = formData.get("article") as string;
        const bodyObj = JSON.parse(articleData);
        const bodyContent = bodyObj.content;

        const italicData = formData.get("italic") as string;
        const italicObj = JSON.parse(italicData);
        const italicContent = italicObj.content;

        const boldData = formData.get("bold") as string;
        console.log('boldData', boldData);
        const boldObj = JSON.parse(boldData);
        console.log('boldObj', boldObj);
        const boldContent = boldObj.content;
        console.log('boldContent', boldContent);
        //
        article.id = idContent;
        article.title = titleContent;
        console.log('article at article.title', article.title);
        article.article = bodyContent;
        article.images = imageUrls;
        article.bold = boldContent;
        console.log('Article bold content added:', article.bold);
        article.italic = italicContent;
        console.log('article before sending to apiRoutes', article);
        // SAVE in db.
        console.log('going to save db');
        const title = article.title;
        console.log('final title', title);
        const body = article.article;
        const images = article.images;
        const bold = article.bold;
        console.log('final bold', bold);
        const italic = article.italic;
        console.log('title at api post', article.title);
        console.log('article at api post', article);
        console.log('images at api post', article.images);
        //
        await update(dbRef, {
            title, body, images, bold, italic
            });
            console.log("Data saved successfully");
        return NextResponse.json({status:200, message: "Data saved successfully"});
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ status: 500, message: "Error processing request." });
    }
        }