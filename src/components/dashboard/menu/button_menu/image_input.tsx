import { ChangeEvent, useContext } from "react";
import MenuContext from "./context/menu_context";
import { ButtonProps } from "./type/type_menu_button";
import uploadImage from "./utils/images_edit/upload_image";
import successAlert from "@/components/alerts/sucess";
import errorAlert from "@/components/alerts/error";

const ImageInput = ({ index }: { index: number }) => {
  //CONTEXT
  //===========================================================
  const { editorRefs, fileInputRef } = useContext(MenuContext) as ButtonProps;
  //

  ///--------------------------------------------------------
  // Function to handle the cases of the MenuButtons
  ///--------------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;

    if (editorRef) {
      const dbName = sessionStorage.getItem("db");
      uploadImage(e, editorRef, dbName!)
        .then((response) => {
          if (response.status === 200) {
            successAlert("image");
          } else {
            errorAlert("image", "non200", response.message);
          }
        })
        .catch((error) => {
          errorAlert("image", "error", error);
        });
    }
  };
  //
  return (
    <label htmlFor={"file-input"} hidden>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </label>
  );
};
export default ImageInput;
