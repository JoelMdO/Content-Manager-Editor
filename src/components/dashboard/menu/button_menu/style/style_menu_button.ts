import { iconsMenu } from "../../../../../constants/icons";

type styleMenuButton = {
  text: string;
  defaultProperties: string;
  icon: string;
};

export function menuButtonStyle(
  type: string,
  isClicked: boolean
): styleMenuButton {
  //
  //console.log("isClicked at buttonstyle:", isClicked);

  // const defaultProperties = `bg-gradient-to-r from-cyan-400 to-secondMenuButtonColor border border-green text-white hover:text-black hover:to-orange-300  hover:border-amber-500 font-bold mt-4 shadow-md shadow-black h-[30px] md:h-[40px] w-[9em]`; // isClicked ? "bg-cream text-black" : ""
  const defaultProperties = `bg-gradient-to-r from-cyan-400 to-secondMenuButtonColor border border-green text-white hover:text-black hover:to-orange-300  hover:border-amber-500 font-bold mt-4 shadow-md shadow-black`; // isClicked ? "bg-cream text-black" : ""
  //
  const defaultStyle: styleMenuButton = {
    text: "Clear",
    defaultProperties: "",
    icon: iconsMenu.clear,
  };

  const stylesByType: Record<string, Partial<styleMenuButton>> = {
    save: {
      text: isClicked ? "Saving..." : "Save",
      defaultProperties: "",
      icon: iconsMenu.save,
    },
    post: {
      text: isClicked ? "Posting..." : "Post",
      defaultProperties: "",
      icon: iconsMenu.post,
    },
    image: {
      text: "Image",
      defaultProperties: "",
      icon: iconsMenu.image,
    },
    link: {
      text: "Link",
      defaultProperties: "",
      icon: iconsMenu.link,
    },
    sections: {
      text: "Sections",
      defaultProperties: "",
      icon: iconsMenu.sections,
    },
    styles: {
      text: "Styles",
      defaultProperties: defaultProperties,
      icon: iconsMenu.styles,
    },
    translate: {
      text: "Translate",
      defaultProperties: defaultProperties,
      icon: iconsMenu.translate,
    },
  };

  const styles = { ...defaultStyle, ...(stylesByType[type] || {}) };

  return {
    text: styles.text,
    defaultProperties: styles.defaultProperties,
    icon: styles.icon,
  };
}
