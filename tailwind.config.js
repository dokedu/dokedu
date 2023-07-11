const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      backgroundColor: {
        strong: colors.stone[200],
        default: colors.white,
        subtle: colors.stone[100],
        muted: colors.stone[50],
        inverted: colors.stone[900],
      },
      // icon, text
      textColor: {
        strong: colors.stone[900],
        default: colors.stone[700],
        subtle: colors.stone[500],
        muted: colors.stone[400],
        inverted: colors.white,
      },
      stroke: {
        colors: {
          strong: colors.stone[900],
          default: colors.stone[700],
          subtle: colors.stone[500],
          muted: colors.stone[400],
          inverted: colors.white,
        },
      },
      border: {
        strong: colors.stone[400],
        default: colors.stone[200],
        subtle: colors.stone[100],
        intense: colors.stone[900],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"),
  require('@tailwindcss/container-queries'),],
};
