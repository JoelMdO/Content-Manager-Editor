// import { useMenuContext } from "@/utils/context/menu_context";
import { useState } from "react";
import MenuButton from "./button_menu/buttons_menu";
import FontStyleUI from "./button_menu/font_style_buttons";
// import { ButtonProps } from "@/components/Menu/Menu Button/type/menu_button_type";

//--------------------------------------------------------
const MenuDesktop = () => {
  //
  const [isStylesOpen, setIsFontStyleOpen] = useState<boolean>(false);
  //
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 mt-3">
      <MenuButton type={"image"} index={1} />
      <MenuButton type={"link"} index={1} />
      <MenuButton type={"sections"} />
      <MenuButton type={"clear"} />
      <MenuButton type={"save"} />
      {/* <MenuButton type={"styles"} /> */}
      <div className="relative flex flex-col items-center">
        {isStylesOpen && (
          <div className="absolute md:left-[14vw] g:left-[9vw] top-1/2 -translate-y-1/2 gap-3 items-center">
            <FontStyleUI
              setIsFontStyleOpen={setIsFontStyleOpen}
              type={"desktop"}
            />
          </div>
        )}
        <MenuButton type={"styles"} setIsFontStyleOpen={setIsFontStyleOpen} />
      </div>
      <MenuButton type={"translate"} />
      <MenuButton type="post" />
    </div>
  );
};

export default MenuDesktop;
