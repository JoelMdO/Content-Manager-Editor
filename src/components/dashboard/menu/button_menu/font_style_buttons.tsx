import { handleFontChange } from "./utils/handle_font_change";
// import { AppDispatch } from "../../store/store";
// import { useDispatch } from "react-redux";
// import text from "../../../constants/buttons_data_text.json";
// import LinkDialog from "./link_dialog";
import { useState } from "react";
// import MenuContext from "../../../utils/context/menu_context";
// import { ButtonProps } from "./type/type_menu_button";
import { menuButtonStyle } from "./style/style_menu_button";

const FontStyleUI: React.FC<{
  setIsFontStyleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuClicked?: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}> = ({ setIsFontStyleOpen, setIsMenuClicked, type }) => {
  ///========================================================
  // To give to the font style as Bold or Italic
  ///========================================================
  const { defaultProperties } = menuButtonStyle("styles", false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const fontTypes = [
    { type: "B", value: "bold" },
    { type: "I", value: "italic" },
    { type: "U", value: "underline" },
  ];

  console.log("Rendering FontStyleUI with fontTypes:", fontTypes);

  return (
    <>
      <div className="md:top-1/2 md:left-1/2 md:transform md:translate-x-1/2 md:translate-y-1/2 flex flex-col justify-center items-center md:justify-normal md:items-start">
        <div className="flex flex-row space-x-3">
          {Array.from(fontTypes).map((font) => (
            <button
              key={font.value}
              type="button"
              data-cy={`${font.value}-button`}
              className={`${
                isPressed
                  ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
                  : defaultProperties
              } mt-2 text-lg text-white border-2 border-green w-8 h-9 `}
              onClick={() => {
                console.log(`Button clicked: ${font.value}`);
                handleFontChange(font.value),
                  setIsFontStyleOpen(false),
                  setIsPressed(true);
                setTimeout(() => {
                  setIsPressed(false);
                  if (type !== "desktop") {
                    setIsMenuClicked!(false);
                  }
                }, 1000);
              }}
            >
              {font.type}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FontStyleUI;
