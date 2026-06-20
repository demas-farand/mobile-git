/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        title: ["Montserrat-Bold", "sans-serif"],
        cookie: ["Cookie-Regular", "sans-serif"],
        regular: ["Montserrat-Regular", "sans-serif"],
      },
      colors: {
        active: "#2B6F7B",
        background: "#F4F8F9",
      }
    },
  },
  plugins: [],
}