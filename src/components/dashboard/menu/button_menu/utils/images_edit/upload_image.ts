import { ChangeEvent } from "react";
import callHub from "../../../../../../services/api/call_hub";
import saveImageTemporally from "./save_img_temp";
//
interface TrackedImage {
  id: string;
  element: HTMLImageElement;
  fileName: string;
}
//
type UploadImageResult = { status: number; message?: string };
//

const uploadImage = async (
  e: ChangeEvent<HTMLInputElement>,
  editorRef: HTMLDivElement | null,
  dbName: string
): Promise<UploadImageResult> => {
  ///========================================================
  // Function to upload an image
  ///========================================================
  //
  try {
    //Array sintax
    const file = e.target.files?.[0];
    const fileName = file?.name;
    //
    // Store reference before API call
    const editorRefBefore = editorRef;
    if (!file || !editorRef) {
      // console.log("no file or not editorRef", file, editorRef);
      return { status: 400, message: "No file or editor reference provided" };
    }

    // Check if the file is a valid image and if its save it on the server
    const response = await callHub("clean-image", file);

    if (response.status === 200) {
      // Set up a FileReader to read the image file source
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) return;
        // Set the image to Base64 for serialization before redux
        const img = document.createElement("img");
        img.src = event.target.result as string;
        img.style.justifySelf = "center";
        img.style.maxWidth = "25%";
        // Create a formatted date string (dd-mm-yy)
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date
          .getFullYear()
          .toString()
          .slice(-2)}`;
        const imageId = `${formattedDate}-${fileName}`;
        //console.log("Image ID:", imageId);

        img.setAttribute("id", imageId); // Set image Id to allow selection
        // Add a reference to the image in the editor
        const imgRef = document.createElement("p");
        imgRef.textContent = imageId;
        imgRef.style.justifySelf = "center";
        imgRef.className = "text-xs text-gray-500";
        // Store `imgRef` on `img` so it can be accessed later
        img.dataset.refId = imageId;
        document.body.appendChild(imgRef);
        document.body.appendChild(img);
        // Create a temporary blob URL for image preview
        const objectUrl = URL.createObjectURL(file);
        // Save updated image temporally
        const responseSaveImage = (await saveImageTemporally(
          file,
          imageId
        )) as {
          status: number;
        };
        if (responseSaveImage.status === 205) return responseSaveImage;
        // Get current article content from sessionStorage
        const articleContent = JSON.parse(
          sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
        );
        // Add image data (file and blobUrl) to articleContent
        articleContent.push({
          type: "image",
          imageId: imageId,
          fileName: file.name,
          blobUrl: objectUrl, // Temporary preview URL
        });
        sessionStorage.setItem(
          `articleContent-${dbName}`,
          JSON.stringify(articleContent)
        );
        //Clic handler to make the image selectable
        img.onclick = (e) => {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNode(e.target as HTMLElement);
          selection?.removeAllRanges();
          selection?.addRange(range);
        };
        // Handle image deletion with the use of right button
        img.oncontextmenu = (e) => {
          e.preventDefault(); // Prevent context menu from opening
          const currentImages: TrackedImage[] = JSON.parse(
            sessionStorage.getItem(`editorImages-${dbName}`) || "[]"
          );
          const updatedImages = currentImages.filter(
            (img) => img.id !== imageId
          );
          sessionStorage.setItem(
            `editorImages-${dbName}`,
            JSON.stringify(updatedImages)
          );
          // Find and remove the correct reference element
          const imgRefToDelete = document.querySelector(
            `p:contains('${imageId}')`
          );
          if (imgRefToDelete) imgRefToDelete.remove();
          img.remove();
        };
        // Insert the image at cursor position
        const editor = editorRefBefore;
        const selection = window.getSelection();
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

        if (range) {
          range.deleteContents();
          range?.insertNode(img);
          range?.collapse(false);
          range?.setStartAfter(img);
          range?.insertNode(imgRef);
          range?.collapse(false);
          // Add a space after image for better editing
          const space = document.createTextNode("\u00A0");
          range.insertNode(space);
          //
          // Trigger input event to save content
          const inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
          });
          editorRef.dispatchEvent(inputEvent);
          //
        } else {
          // If no selection, append at the end of the editor
          editor?.appendChild(img);
          editor?.appendChild(imgRef);
        }

        // Clear file input
        e.target.value = "";
      };
      reader.readAsDataURL(file);
      return { status: 200, message: "Image uploaded successfully" };
    } else {
      return { status: 205, message: "Image not valid" };
    }
  } catch (error) {
    return { status: 205, message: error as string };
  }
};

export default uploadImage;
