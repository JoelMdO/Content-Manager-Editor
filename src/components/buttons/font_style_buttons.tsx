import { handleFontChange } from "../../utils/dashboard/handle_font_change";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import text from "../../constants/buttons_data_text.json";

const FontStyleUI: React.FC = () => {
  ///========================================================
  // To give to the font style as Bold or Italic
  ///========================================================
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className="mt-4 flex flex-col justify-center items-center md:justify-normal md:items-start">
        <span className="text-white md:text-base text-xs flex justify-center">
          {text.buttons.fontStyle}
        </span>
        <div className="flex md:flex-row flex-col md:space-x-3">
          <button
            type="button"
            className="mt-2 text-lg text-white border-2 border-green w-8 h-9 "
            onClick={() => handleFontChange("bold", dispatch)}
          >
            B
          </button>
          <button
            type="button"
            className="italic mt-2 text-lg text-white border-2 border-green w-8 h-9"
            onClick={() => handleFontChange("italic", dispatch)}
          >
            I
          </button>
        </div>
      </div>
    </>
  );
};

export default FontStyleUI;
