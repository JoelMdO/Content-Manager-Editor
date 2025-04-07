import type { Config } from "tailwindcss";
import colors from "./src/utils/colors";

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
          'gray-forms': colors.gray_forms
      },
    },
  },
  plugins: [],
} satisfies Config;
