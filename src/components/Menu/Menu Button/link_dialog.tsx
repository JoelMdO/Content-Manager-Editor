import insertLink from "@/utils/dashboard/insert_link";
import successAlert from "../../alerts/sucess";
import errorAlert from "../../alerts/error";
import text from "../../../constants/buttons_data_text.json";
import { useContext, useRef } from "react";
import { ButtonProps } from "./type/type_menu_button";
import MenuContext from "../../../utils/context/menu_context";

const LinkDialog = ({
  index,
}: // setIsClicked,
{
  index?: number;
  // setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  ///========================================================
  // To load links and store them in IndexedDB for later save on db.
  ///========================================================
  //
  //CONTEXT
  //=========================================================
  const { editorRefs, dialogRef, setIsClicked } = useContext(
    MenuContext
  ) as ButtonProps;
  // Ensure dialogRef is defined
  console.log("link dialog", index, "dialogref ", dialogRef);

  // Ensure safe access to editorRefs
  const editorRef = editorRefs?.current ? editorRefs.current[index!] : null;
  const linkInputRef = useRef<HTMLInputElement>(null);
  // getLink value
  let link_url: string;
  const getLinkValue = () => {
    if (linkInputRef.current) {
      link_url = linkInputRef.current.value;
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="modal bg-blue w-[60vw] md:w-[50vw] g:w-[30vw] h-[20%] rounded shadow-lg z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
                  dialogRef!.current?.close();
                  // setIsClicked(false);
                  if (response.status === 200) {
                    successAlert("link");
                  } else {
                    errorAlert("link", "non200", response.message);
                  }
                })
                .catch((error) => {
                  errorAlert("link", "error", error);
                  linkInputRef.current!.value = "";
                  dialogRef!.current?.close();
                });
            }}
          >
            {text.buttons.submit}
          </button>
          <button
            className="btn border-blue-light text-white border-b-2"
            type="button"
            onClick={() => {
              dialogRef!.current?.close();
              // setIsClicked(false);
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
