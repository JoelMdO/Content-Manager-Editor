import {handleFontChange} from "../services/font_style"; 
import { AppDispatch } from "../services/store";
import { useDispatch} from "react-redux";
const FontStyleUI: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <>
        <div className="mt-4 flex flex-col">
            <label className="text-white">Font Style</label>
            <div className="flex-row space-x-3">
            <button className="mt-2 text-lg text-white border-2 border-green w-8 h-9 " onClick={() => handleFontChange("bold", dispatch)}>B</button>
            <button className="italic mt-2 text-lg text-white border-2 border-green w-8 h-9" onClick={() => handleFontChange("italic", dispatch)}>I</button>
        </div></div>
        </>
    );
};

export default FontStyleUI;