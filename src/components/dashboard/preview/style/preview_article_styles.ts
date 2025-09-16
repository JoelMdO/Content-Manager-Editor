const previewArticleStyles = {
  title: "text-lg mt-6 ml-6 font-bold md:text-4xl md:mt-8 md:ml-10",
  title_container: "w-[55%] md:w-[70%]",
  time_to_read: "text-[8px] italic mt-1 ml-10 md:text-sm md:mt-2 md:ml-[25vw]",
  language_switch: "text-xs mt-1 ml-2 md:text-base md:mt-1 md:mr-2 ",
  language_switch_container: "w-[45%] md:w-[35%]",
  h: "text-xs mt-2 md:ml-6 ml-2 font-medium md:text-lg md:mt-2 md:font-medium",
  paragraph:
    "text-[10px] mt-1 mb-1 md:text-base md:self-center w-[80%] md:text-justify",
  list: "text-[10px] mt-2 mb-1 self-center md:text-base",
  image_container: "w-[45vw] h-[15dvh] mt-2 mb-1 md:h-[35dvh]",
  blockquote_container:
    "text-xs w-[90%] pl-2 pr-2 my-4 rounded-r-lg shadow-lg self-center border-l-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 italic text-gray-600 dark:text-gray-400 md:ml-10 md:text-base",
  code: "text-[8px] md:text-sm",
  code_container: "text-xs md:text-base",
  th: "px-6 py-3 text-sm md:text-base",
  td: "px-6 py-4 text-sm md:text-base",
} as const;

export default previewArticleStyles;
