/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif", "system-ui"],
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("@tailwindcss/forms"),
  ],
}

