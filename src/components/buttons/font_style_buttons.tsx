import { handleFontChange } from "../../utils/dashboard/handle_font_change";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import text from "../../constants/buttons_data_text.json";

const FontStyleUI: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  ///========================================================
  // To give to the font style as Bold or Italic
  ///========================================================
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className="mt-4 flex flex-col justify-center items-center md:justify-normal md:items-start" data-testid={testId}>
        <span className="text-white md:text-base text-xs flex justify-center">
          {text.buttons.fontStyle}
        </span>
        <div className="flex md:flex-row flex-col md:space-x-3">
          <button
            type="button"
            className="mt-2 text-lg text-white border-2 border-green w-8 h-9"
            data-testid="bold-button"
            onClick={() => handleFontChange("bold", dispatch)}
          >
            B
          </button>
          <button
            type="button"
            className="italic mt-2 text-lg text-white border-2 border-green w-8 h-9"
            data-testid="italic-button"
            onClick={() => handleFontChange("italic", dispatch)}
          >
            I
          </button>
          <button
            type="button"
            className="underline mt-2 text-lg text-white border-2 border-green w-8 h-9"
            data-testid="underline-button"
            onClick={() => handleFontChange("underline", dispatch)}
          >
            U
          </button>
        </div>
      </div>
    </>
  );
};

export default FontStyleUI;
