import { useContext, useEffect, useState } from "react";
import MenuButton from "./button_menu/buttons_menu";
import {
  // ButtonProps,
  iconsMenu,
} from "../../../constants/icons";
import FontStyleUI from "./button_menu/font_style_buttons";
import { ButtonProps } from "./button_menu/type/type_menu_button";
import MenuContext from "./button_menu/context/menu_context";
// import MenuContext from "../../utils/context/menu_context";

//--------------------------------------------------------
const MenuMobile = () => {
  //
  //console.log("selectedSection at menumobile:", selectedSection);
  const [isMenuClicked, setIsMenuClicked] = useState<boolean>(false);
  const [isStylesOpen, setIsFontStyleOpen] = useState<boolean>(false);
  const { isClicked } = useContext(MenuContext) as ButtonProps;
  // const { isClicked, setIsClicked } = useContext(MenuContext) as ButtonProps;
  // function toggleMenu() {
  //   const menu = document.getElementById("menuItems");
  //   if (menu) {
  //     menu.classList.toggle("hidden");
  //   }
  // }
  // console.log("ismediumScreen:", isMediumScreen);
  // console.log("selectedSection:", selectedSection);
  //
  return (
    <>
      <div className="flex justify-center items-center w-full h-full">
        <button
          type="button"
          className={`fixed bottom-[20px] right-[20px] w-[50px] h-[50px] z-50 bg-gradient-to-r ${
            isMenuClicked
              ? " from-green to-amber-400"
              : "from-cyan-400 to-white"
          } rounded-full flex items-center justify-center mb-6`}
          onClick={() => {
            // toggleMenu();
            setIsMenuClicked(!isMenuClicked);
          }}
        >
          <span className="flex items-center justify-center w-full h-full text-3xl">
            {iconsMenu.menu}
          </span>
        </button>
        <div
          className={`absolute bottom-[110px] right-[30px] gap-y-2 flex-col w-auto ${
            isMenuClicked ? "flex" : "hidden"
          }`}
          id="menuItems"
        >
          <MenuButton
            type={"image"}
            index={1}
            setIsMenuClicked={setIsMenuClicked}
          />
          <MenuButton
            type={"link"}
            index={1}
            setIsMenuClicked={setIsMenuClicked}
          />
          <MenuButton type={"sections"} setIsMenuClicked={setIsMenuClicked} />
          <MenuButton type={"clear"} setIsMenuClicked={setIsMenuClicked} />
          <MenuButton type={"save"} setIsMenuClicked={setIsMenuClicked} />
          <div className="relative flex flex-col items-center">
            {isStylesOpen && (
              <div className="absolute left-[-40vw] top-1/2 -translate-y-1/2 gap-3 items-center">
                <FontStyleUI
                  type="mobile"
                  setIsFontStyleOpen={setIsFontStyleOpen}
                  setIsMenuClicked={setIsMenuClicked}
                />
              </div>
            )}
            <MenuButton
              type={"styles"}
              setIsFontStyleOpen={setIsFontStyleOpen}
            />
          </div>
          <MenuButton type={"translate"} setIsMenuClicked={setIsMenuClicked} />
          <MenuButton type={"post"} setIsMenuClicked={setIsMenuClicked} />
        </div>
      </div>
    </>
  );
};

export default MenuMobile;
