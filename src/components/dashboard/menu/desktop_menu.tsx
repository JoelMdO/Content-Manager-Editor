import { useState } from "react";
import MenuButton from "./button_menu/buttons_menu";
import FontStyleUI from "./button_menu/font_style_buttons";

//--------------------------------------------------------
const MenuDesktop = () => {
  //
  const [isStylesOpen, setIsFontStyleOpen] = useState<boolean>(false);
  //
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 mt-3">
      <MenuButton type={"image"} index={1} tag={"desktop"} />
      <MenuButton type={"link"} index={1} tag={"desktop"} />
      <MenuButton type={"sections"} tag={"desktop"} />
      <MenuButton type={"clear"} tag={"desktop"} />
      <MenuButton type={"save"} tag={"desktop"} />
      <div className="relative flex flex-col items-center">
        {isStylesOpen && (
          <div className="absolute md:left-[14vw] g:left-[9vw] top-1/2 -translate-y-1/2 gap-3 items-center">
            <FontStyleUI
              setIsFontStyleOpen={setIsFontStyleOpen}
              type={"desktop"}
            />
          </div>
        )}
        <MenuButton
          type={"styles"}
          setIsFontStyleOpen={setIsFontStyleOpen}
          tag={"desktop"}
        />
      </div>
      <MenuButton type={"summary"} tag={"desktop"} />
      <MenuButton type={"translate"} tag={"desktop"} />
      <MenuButton type="post" tag={"desktop"} />
    </div>
  );
};

export default MenuDesktop;
