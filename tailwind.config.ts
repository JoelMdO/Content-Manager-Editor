import type { Config } from "tailwindcss";
import colors from "./src/constants/colors";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        md: '768px',
        sm: '480px',
        xs: '360px',
      },
      colors: {
          'light-background': colors.light.background,
          'light-foreground': colors.light.foreground,
          'dark-background': colors.dark.background,
          'dark-foreground': colors.dark.foreground,
          'green': colors.green,
          'blue': colors.blue,
          'yellow': colors.yellow,
          'blue-light': colors.blue_light,
          'red': colors.red, 
          'cream': colors.cream,
          'gray-forms': colors.gray_forms,
          'yellow-button': colors.yellow_button,
          'decav-toast-color': colors.decav_toast_color,
          'joel-toast-color': colors.joel_toast_color,
          'blur-toast-color': colors.blur_toast_color
      },
    },
  },
  plugins: [],
} satisfies Config;
