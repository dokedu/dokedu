const defaultTheme = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""'
            },
            "code::after": {
              content: '""'
            }
          }
        }
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono]
      },
      backgroundColor: {
        strong: colors.neutral[200],
        default: colors.white,
        subtle: colors.neutral[100],
        muted: colors.neutral[50],
        inverted: colors.neutral[900]
      },
      // icon, text
      textColor: {
        strong: colors.neutral[900],
        default: colors.neutral[700],
        subtle: colors.neutral[500],
        muted: colors.neutral[400],
        inverted: colors.white
      },
      stroke: {
        colors: {
          strong: colors.neutral[900],
          default: colors.neutral[700],
          subtle: colors.neutral[500],
          muted: colors.neutral[400],
          inverted: colors.white
        }
      },
      borderColor: {
        strong: colors.neutral[400],
        default: colors.neutral[200],
        subtle: colors.neutral[100],
        intense: colors.neutral[900]
      },
      
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography")
  ]
}
