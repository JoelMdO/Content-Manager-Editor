const logOutButtonConfig = {
  //
  playbook: {
    widthSet: 50,
    heightSet: 60,
    mt: "md:mt-0",
    mb: "md:mb-0",
    icon_mobile: "",
  },
  dashboard: {
    widthSet: 50,
    heightSet: 50,
    mt: "md:mt-0",
    mb: "md:mb-0",
    icon_mobile: "/window_exit.png",
  },
  default: {
    widthSet: 80,
    heightSet: 80,
    mt: "md:mt-auto",
    mb: "md:mb-14",
    icon_mobile: "/window_exit.png",
  },
};

export default logOutButtonConfig;
export type LogOutButtonConfigType = typeof logOutButtonConfig;
