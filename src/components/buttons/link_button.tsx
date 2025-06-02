import React, { useRef } from "react";
import Image from "next/image";
import insertLink from "../../utils/dashboard/insert_link";
import successAlert from "../alerts/sucess";
import errorAlert from "../alerts/error";
import text from "../../constants/buttons_data_text.json";

interface LinkButtonProps {
  editorRefs?: React.RefObject<(HTMLDivElement | null)[]>;
  index?: number;
  "data-cy"?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  editorRefs = null,
  index = 0,
  "data-cy": dataCy,
}) => {
  ///========================================================
  // To load links and store them in IndexedDB for later save on db.
  ///========================================================
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
    }
  };
  //
  ///--------------------------------------------------------
  // UI with a button to add a link
  ///--------------------------------------------------------
  return (
    <>
      <button
        type="button"
        className={`h-[40px] w-[9em] shadow-md shadow-black bg-blue hover:bg-green text-white text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4`}
        data-cy={dataCy}
        onClick={() => dialogRef.current?.showModal()}
      >
        <Image
          src="/link.png"
          className="md:w-6 md:h-6 w-3 h-3 cursor-pointer"
          width={12}
          height={12}
          alt="uploaded-image"
        />
        {text.buttons.pasteLink}
      </button>
      <dialog
        ref={dialogRef}
        className="modal bg-blue md:w-[30%] w-[60%] h-[20%] rounded shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        data-cy="dialog-link"
      >
        <form
          method="dialog"
          className="modal-box flex flex-col justify-center items-center"
        >
          <h3 className="pt-2 pb-2 font-bold text-white text-lg text-center">
            {text.buttons.addLink}
          </h3>
          <input
            ref={linkInputRef}
            type="text"
            className="input input-bordered border-green w-[90%] h-[40px]"
            placeholder=" Paste the link/url"
            data-cy="dialog-input-link"
            onChange={getLinkValue}
          />
          <div className="pt-4 modal-action flex flex-row items-center justify-evenly w-full">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn border-green text-white border-b-2"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                insertLink("cms", link_url, editorRef)
                  .then((response) => {
                    linkInputRef.current!.value = "";
                    dialogRef.current?.close();
                    if (response.status === 200) {
                      successAlert("link");
                    } else {
                      errorAlert("link", "non200", response.message);
                    }
                  })
                  .catch((error) => {
                    errorAlert("link", "error", error);
                    linkInputRef.current!.value = "";
                    dialogRef.current?.close();
                  });
              }}
            >
              {text.buttons.submit}
            </button>
            <button
              className="btn border-blue-light text-white border-b-2"
              type="button"
              onClick={() => dialogRef.current?.close()}
            >
              {text.buttons.close}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default LinkButton;
