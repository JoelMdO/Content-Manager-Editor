import { ChangeEvent, useContext } from "react";
import MenuContext from "../../../utils/context/menu_context";
import { ButtonProps } from "./type/type_menu_button";
import uploadImage from "@/utils/dashboard/images_edit/upload_image";
import successAlert from "@/components/alerts/sucess";
import errorAlert from "@/components/alerts/error";

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
  console.log("editorRef at ImageInput:", editorRefs);

  ///--------------------------------------------------------
  // Function to handle the cases of the MenuButtons
  ///--------------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("fdoing handling change");

    const editorRef = editorRefs?.current ? editorRefs.current[index] : null;

    if (editorRef) {
      console.log("editorRef:", editorRef);

      const dbName = sessionStorage.getItem("db");
      //debugger;
      uploadImage(e, editorRef, dbName!)
        .then((response) => {
          setIsClicked(false);
          if (response.status === 200) {
            successAlert("image");
          } else {
            errorAlert("image", "non200", response.message);
          }
        })
        .catch((error) => {
          console.log("Error uploading image:", error);
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
