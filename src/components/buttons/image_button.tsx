import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import uploadImage from "../../utils/images_edit/upload_image";
import { AppDispatch } from "../../services/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import successAlert from "../alerts/sucess";
import errorAlert from "../alerts/error";

interface ButtonProps {
    editorRefs?: React.RefObject<(HTMLDivElement | null)[]>;
    index?: number;
}

const ImageButton: React.FC<ButtonProps> = ({editorRefs=null, index=0}) => {
    //
    // Ensure safe access to editorRefs
    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;
    const fileInputRef = useRef<HTMLInputElement>(null);
    // States
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    // redux
    const dispatch = useDispatch<AppDispatch>();
    //Functions for button click.
    const handleButtonClick = () => {
        setSaveButtonClicked(true);
        fileInputRef.current?.click();
    };
    //Functions for input file loading.
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (editorRef) {
        uploadImage(e, editorRef, dispatch)
            .then((response) => {
            setSaveButtonClicked(false);
            if (response.status === 200) {
                successAlert("image");
            } else {
                errorAlert("image", "non200", response.message);
            }
            })
            .catch((error) => {
            setSaveButtonClicked(false);
            errorAlert("image", "error", error);
            });
        }
    };
    //
    return ( 
        <>
            <button
                className={`h-[40px] w-[9em] shadow-md shadow-black ${saveButtonClicked ? "bg-cream" : "bg-blue"} hover:bg-green ${saveButtonClicked ? "text-black" : "text-white"} text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4`}
                onClick={() => {
                    handleButtonClick();
                    }}>
            <Image src="/upload-outline.png" className="md:w-6 md:h-6 w-3 h-3 cursor-pointer" width={12} height={12} alt="uploaded-image"/>Add Image
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" />
        </>
    );
    
}

export default ImageButton;