import HomeButton from "@/components/buttons/home_button";
import LogOutButton from "@/components/buttons/logout_buttons";
import MenuButton from "./button_menu/buttons_menu";
//import PreviewToggle from "./preview_toggle/preview_toggle";

//--------------------------------------------------------
const MenuDesktop = () => {
  //
  //const [isStylesOpen, setIsFontStyleOpen] = useState<boolean>(false);
  //
  return (
    <div className="hidden md:flex flex-col items-center justify-center gap-y-2 mt-3">
      {/* <PreviewToggle /> */}
      <MenuButton type={"image"} index={1} tag={"desktop"} />
      <MenuButton type={"link"} index={1} tag={"desktop"} />
      <MenuButton type={"sections"} tag={"desktop"} />
      <MenuButton type={"clear"} tag={"desktop"} />
      <MenuButton type={"save"} tag={"desktop"} />
      <MenuButton type={"summary_selector"} tag={"desktop"} />
      <MenuButton type={"translate"} tag={"desktop"} />
      <MenuButton type="post" tag={"desktop"} />
      <HomeButton />
      <LogOutButton type={"dashboard"} />
    </div>
  );
};

export default MenuDesktop;
