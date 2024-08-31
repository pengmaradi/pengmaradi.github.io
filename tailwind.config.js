/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./*.html",
    "./src/*.{js,jsx,pcss,html,md}",
    "./_includes/*.{html,md}",
    "./_layouts/*.{html,md}",
    "./_posts/*.{html,md}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

