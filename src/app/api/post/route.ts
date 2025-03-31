import { database } from "../../../../firebase";
import { ref, update} from "firebase/database";
import { NextResponse } from "next/server";
// import { supabase } from "../../../lib/supabase_client";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import { forEach } from "lodash";
import replaceSrcWithImagePlaceholders from "../../../utils/images_edit/replace_src_on_img";

export async function POST(req: Request): Promise<Response> {
    ///---------------------------------------------------
    /// POST (Save) to database firebase.
    ///---------------------------------------------------
    ///
    /// Variables.
    const imageUrls: { url: string }[] = [];
    const formData = await req.formData();
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
                const fileData = formData.get(key);
                if (fileData instanceof Blob) { 
                    fileName = fileData.name || key;
                    // Convert to File
                    const file = new File([fileData], fileName, { type: fileData.type });
                    imageFiles.push(file);
                  
                } else {
                    const fileData = formData.get(key);
                    imageFiles.push(fileData as File);
                    
                } 
            }
        }

        if(imageFiles.length > 0){
            //Filter valid file objects
                pre_images = imageFiles.filter((value): value is File => value instanceof File);

            await Promise.all(pre_images.map(async (item: File) => {
                return new Promise<void>(async (resolve, reject) => {
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
                        if (uploadError){
                            // Handle upload error
                            return NextResponse.json({ status: 500, message: "Error uploading image. No URL." });
                        }
                            // Get public URL
                        if(result?.secure_url){
                    // CLOUDINARY URL
                        let urlCloudinary : string | undefined = "";
                        urlCloudinary = (result?.secure_url); 
                        imageUrls.push({ url: urlCloudinary! });
                        }
                        resolve();
                        })//     // Update image URL in article content   
                        // If any images were uploaded, update the article's images array
                        if (imageUrls.length > 0) {
                            article.images = imageUrls;  // Append image URLs to article.images
                        }})}));
        }
        ///================================================================
        /// SAVE　THE FULL ARTICLE to database:
        ///================================================================
        // Parse individual fields
        const titleData = formData.get("title") as string;
        const titleObj = JSON.parse(titleData);
        const titleContent = titleObj.content;

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
        const boldObj = JSON.parse(boldData);
        const boldContent = boldObj.content;
        //
        article.id = idContent;
        article.title = titleContent;
        article.article = bodyContent;
        article.images = imageUrls;
        article.bold = boldContent;
        article.italic = italicContent;
        
        // SAVE in db.
        const id = article.id;
        const title = article.title;
        let body = article.article;
        let images = article.images;
        let bold = article.bold;  
        let italic = article.italic;
        //
        const userId = formData.get("session")as string;

        try{
        const dbRef = ref(database, `articles/${id}`);
        const arrayData = [images, bold, italic];
        forEach(arrayData, (value) => {
            if(Array.isArray(value) && value.length === 0){

                if (value === images) {
                        images = [{ url: "nil" }];
                } else if (value === bold) {
                        bold = ["nil"];
                } else {
                    italic=["nil"];
                }}
            });
        // Replace src of the each image with the corresponded url:
        body = replaceSrcWithImagePlaceholders(body, images);
        
        const articleData = {
            id,
            title,
            body,
            images,
            bold,
            italic
        };
        // const articleDataJson = JSON.stringify(articleData);
        
        await update(dbRef, {
            articleData});
            return NextResponse.json({status:200, message: "Data saved successfully", body: body});
        }catch (error) {
            return NextResponse.json({ status: 500, message: `Error processing request. ${error}` });
        }
    } catch (error) {
        return NextResponse.json({ status: 500, message: `Error processing request. ${error}`});
    }
        }