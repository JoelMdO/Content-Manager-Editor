import React, {useRef} from "react";
import { AppDispatch } from "../services/store";
import { useDispatch} from "react-redux";
import Image from "next/image";
import insertLink from "@/services/insert_link";
import successAlert from "./alerts/sucess";
import errorAlert from "./alerts/error";
import { get } from "lodash";

interface LinkButtonProps {
    editorRefs?: React.RefObject<(HTMLDivElement | null)[]>;
    index?: number
}

const LinkButton: React.FC<LinkButtonProps> = ({editorRefs=null, index=0}) => {
    //
    // Ensure safe access to editorRefs
    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;
    const dialogRef = useRef<HTMLDialogElement>(null); 
    const linkInputRef = useRef<HTMLInputElement>(null);
    // getLink value
    let link_url: string;
    const getLinkValue = () => {
        if (linkInputRef.current) {
            link_url = linkInputRef.current.value;
            console.log("Pasted Link:", linkInputRef.current.value);
        }
    };
    // redux
    const dispatch = useDispatch<AppDispatch>();
    //
    return ( 
        <>
            <button
                className={`h-[40px] w-[9em] bg-blue hover:bg-green text-white text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4`} 
                onClick={() => 
                    dialogRef.current?.showModal()}>
            <Image src="/link.png" className="md:w-6 md:h-6 w-3 h-3 cursor-pointer" width={12} height={12} alt="uploaded-image"/>Paste Link
            </button>
            <dialog ref={dialogRef} className="modal bg-blue w-[30%] h-[20%] rounded shadow-lg ">
                <form method="dialog" className="modal-box flex flex-col justify-center items-center">
                <h3 className="pt-2 pb-2 font-bold text-white text-lg text-center    ">Add Link</h3>
                <input ref={linkInputRef}
                    type="text"
                    className="input input-bordered border-green w-[90%] h-[40px]"
                    placeholder=" Paste the link/url"
                    onChange={getLinkValue}/>
                <div className="pt-4 modal-action flex flex-row items-center justify-evenly w-full">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn border-green text-white border-b-2"
                    onClick={() => insertLink(dispatch, link_url, editorRef)
                        .then((response) => {
                            if (response.status === 200) {
                            successAlert("link");
                            linkInputRef.current!.value = "";
                            } else {
                            errorAlert("link","non200", response.message);
                            linkInputRef.current!.value = "";
                            }
                        }).catch((error) => {
                            errorAlert("link", "error",error);
                            linkInputRef.current!.value = "";
                        })
                    } 
                    >Submit</button>
                    <button className="btn border-blue-light text-white border-b-2"
                    onClick={() => dialogRef.current?.close()}
                    >Close</button>
                </div>
                </form>
            </dialog>
        </>
    );
}

export default LinkButton;