import insertLink from "./utils/insert_link";
import successAlert from "../../../alerts/sucess";
import errorAlert from "../../../alerts/error";
import text from "../../../../constants/buttons_data_text.json";
import { useContext, useRef, useState } from "react";
import { ButtonProps } from "./type/type_menu_button";
import MenuContext from "./context/menu_context";

const LinkDialog = ({ index }: { index?: number }) => {
  ///========================================================
  // To load links and store them in IndexedDB for later save on db.
  ///========================================================
  //
  //CONTEXT
  //=========================================================
  const { editorRefs, dialogRef } = useContext(MenuContext) as ButtonProps;
  // Ensure dialogRef is defined

  // Ensure safe access to editorRefs
  const editorRef = editorRefs?.current ? editorRefs.current[index!] : null;
  const linkInputRef = useRef<HTMLInputElement>(null);

  let link_url: string;
  //------------------------------------------
  // Purpose: State to hold the suggested link title
  //------------------------------------------
  const [suggestedTitle, setSuggestedTitle] = useState<string>("");
  const [editableTitle, setEditableTitle] = useState<string>("");
  //------------------------------------------
  // Purpose: Extract a title from the URL (filename or domain)
  //------------------------------------------
  const extractTitleFromUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      // Try to get filename from path
      const pathParts = parsed.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart.includes(".")) {
        return decodeURIComponent(lastPart);
      }
      // Otherwise, use the hostname
      return parsed.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  //------------------------------------------
  // Purpose: Handle link input change and suggest a title
  //------------------------------------------
  const getLinkValue = async () => {
    if (linkInputRef.current) {
      link_url = linkInputRef.current.value;
      // Try to fetch the <title> tag (may fail due to CORS)
      let title = extractTitleFromUrl(link_url);
      setSuggestedTitle(title);
      setEditableTitle(title);
    }
  };
  //------------------------------------------
  // Purpose: Handle editable title change
  //------------------------------------------
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  //------------------------------------------
  // Purpose: Handle link insertion with editable title
  //------------------------------------------
  const handleInsertLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link_url = linkInputRef.current?.value || "";
    console.log("edited text", editableTitle);

    insertLink("cms", link_url, editorRef, editableTitle)
      .then((response) => {
        linkInputRef.current!.value = "";
        setEditableTitle("");
        setSuggestedTitle("");
        dialogRef!.current?.close();
        if (response.status === 200) {
          successAlert("link");
        } else {
          errorAlert("link", "non200", response.message);
        }
      })
      .catch((error) => {
        errorAlert("link", "error", error);
        linkInputRef.current!.value = "";
        setEditableTitle("");
        setSuggestedTitle("");
        dialogRef!.current?.close();
      });
  };
  // const getLinkValue = () => {
  //   if (linkInputRef.current) {
  //     link_url = linkInputRef.current.value;
  //   }
  // };
  return (
    <dialog
      ref={dialogRef}
      className="modal bg-blue w-[60vw] md:w-[50vw] g:w-[30vw] h-[30%] rounded shadow-lg z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
        {/* Show the suggested title if available */}
        {suggestedTitle && (
          <div className="mt-2 w-[90%]">
            <label className="block text-white text-sm italic mb-1">
              Suggested Title (edit if needed):
            </label>
            <input
              type="text"
              className="input input-bordered border-green w-full h-[36px] text-black"
              value={editableTitle}
              onChange={handleTitleChange}
              placeholder="Link title"
              data-cy="dialog-input-link-title"
            />
          </div>
        )}
        <div className="pt-4 modal-action flex flex-row items-center justify-evenly w-full">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn border-green text-white border-b-2"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleInsertLink(e);
            }}
          >
            {text.buttons.submit}
          </button>
          <button
            className="btn border-blue-light text-white border-b-2"
            type="button"
            onClick={() => {
              dialogRef!.current?.close();
              setEditableTitle("");
              setSuggestedTitle("");
            }}
          >
            {text.buttons.close}
          </button>
        </div>
      </form>
    </dialog>
  );
};
export default LinkDialog;
