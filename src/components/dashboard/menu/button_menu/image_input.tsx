import { ChangeEvent } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import uploadImage from "./utils/images_edit/upload_image";
import successAlert from "@/components/alerts/sucess";
import errorAlert from "@/components/alerts/error";

const ImageInput = ({ index }: { index: number }) => {
  const fileInputRef = useEditorStore((s) => s.fileInputRef);
  void index; // index no longer used — images always go into the body editor

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const editor = useEditorStore.getState().bodyEditorRef.current;
    if (editor) {
      const dbName = sessionStorage.getItem("db");
      uploadImage(e, editor, dbName!)
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

  return (
    <label htmlFor={"file-input"} hidden>
      <input
        data-cy="file-input"
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
