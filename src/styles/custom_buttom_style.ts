type styleCustomDashboardButton = {
  text: string;
  isNew: boolean;
  color: string;
  hover_color: string;
  otherFeatures: string;
  textColor: string;
  icon: string;
  position: string;
  shadow: string;
  height: string;
  width: string;
};

export function custommButtonStyle(
  type: string,
  isCreating: boolean | undefined,
  isClicked: boolean
): styleCustomDashboardButton {
  //

  const defaultStyle: styleCustomDashboardButton = {
    text: "Clear",
    isNew: false,
    color: "bg-blue",
    hover_color: "bg-green",
    otherFeatures: "font-bold mt-4",
    textColor: "text-white",
    icon: "/clear.png",
    position: "",
    shadow: "shadow-md shadow-black",
    height: "h-[40px]",
    width: "w-[9em]",
  };

  const stylesByType: Record<string, Partial<styleCustomDashboardButton>> = {
    post: {
      text: "Post",
      isNew: false,
      color: "bg-green",
      hover_color: "bg-green-light",
      otherFeatures: "",
      textColor: isClicked ? "text-black" : "text-white",
      icon: "/inbox.png",
      position: "",
      shadow: "",
      height: "h-[30px]",
      width: "w-[9em]",
    },
    new: {
      text: isCreating ? "Cancel" : "Create New Entry",
      isNew: true,
      color: "bg-blue-light",
      hover_color: "bg-green",
      otherFeatures: "font-bold p-1",
      textColor: "",
      icon: "",
      position: "",
      shadow: "",
      height: "",
      width: "w-fit",
    },
    "view-note": {
      text: "View Details",
      isNew: true,
      color: "bg-gray-100",
      hover_color: "bg-gray-200",
      otherFeatures: "py-2 rounded transition mt-4 font-bold",
      textColor: "text-black",
      icon: "",
      position: "",
      shadow: "shadow-sm shadow-gray-800",
      height: "",
      width: "w-full",
    },
    updatePlaybook: {
      text: "Cancel",
      isNew: true,
      color: "bg-gray-300",
      hover_color: "bg-blue-light",
      otherFeatures: "px-6 py-3 p-1 border border-gray-300 rounded-md",
      textColor: "text-gray-700",
      icon: "",
      position: "",
      shadow: "",
      height: "",
      width: "",
    },
    "new-playbook": {
      text: "Cancel",
      isNew: true,
      color: "bg-gray-300",
      hover_color: "bg-blue-light",
      otherFeatures:
        "px-6 py-3 border border-gray-300 rounded-md text-bold text-base",
      textColor: "text-gray-700",
      icon: "",
      position: "",
      shadow: "",
      height: "",
      width: "",
    },
    "with-item-playbook": {
      text: "Cancel",
      isNew: true,
      color: "bg-gray-300",
      hover_color: "bg-blue-light",
      otherFeatures: "px-6 py-3 border border-gray-300 rounded-md",
      textColor: "text-gray-700",
      icon: "",
      position: "",
      shadow: "",
      height: "",
      width: "",
    },
    "new-playbook-at-readplaybook": {
      text: "Cancel",
      isNew: true,
      color: "bg-gray-300",
      hover_color: "bg-blue-light",
      otherFeatures:
        "px-6 py-3 border border-gray-300 rounded-md text-bold text-base",
      textColor: "text-gray-700",
      icon: "",
      position: "",
      shadow: "",
      height: "h-[56px]",
      width: "w-fit",
    },
  };

  const styles = { ...defaultStyle, ...(stylesByType[type] || {}) };

  return {
    text: styles.text,
    isNew: styles.isNew,
    color: styles.color,
    hover_color: styles.hover_color,
    otherFeatures: styles.otherFeatures,
    textColor: styles.textColor,
    icon: styles.icon,
    position: styles.position,
    shadow: styles.shadow,
    height: styles.height,
    width: styles.width,
  };
}
