import { ChangeEvent, useContext } from "react";
import MenuContext from "./context/menu_context";
import { ButtonProps } from "./type/type_menu_button";
import uploadImage from "./utils/images_edit/upload_image";
import successAlert from "@/components/alerts/sucess";
import errorAlert from "@/components/alerts/error";

<<<<<<< HEAD
const ImageInput = ({ index }: { index: number }) => {
  //CONTEXT
  //===========================================================
  const { editorRefs, fileInputRef } = useContext(MenuContext) as ButtonProps;
  //
=======
const ImageInput = ({
  index,
}: // setIsClicked,
{
  index: number;
  // setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //CONTEXT
  //===========================================================
  const { editorRefs, fileInputRef, setIsClicked } = useContext(
    MenuContext
  ) as ButtonProps;
  //
  //console.log("editorRef at ImageInput:", editorRefs);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

  ///--------------------------------------------------------
  // Function to handle the cases of the MenuButtons
  ///--------------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
<<<<<<< HEAD
    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;

    if (editorRef) {
      const dbName = sessionStorage.getItem("db");
=======
    //console.log("fdoing handling change");

    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;

    if (editorRef) {
      // console.log("editorRef:", editorRef);

      const dbName = sessionStorage.getItem("db");
      //debugger;
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      uploadImage(e, editorRef, dbName!)
        .then((response) => {
          if (response.status === 200) {
            successAlert("image");
          } else {
            errorAlert("image", "non200", response.message);
          }
        })
        .catch((error) => {
<<<<<<< HEAD
=======
          //   console.log("Error uploading image:", error);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
          errorAlert("image", "error", error);
        });
    }
  };
  //
  return (
    <label>
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
