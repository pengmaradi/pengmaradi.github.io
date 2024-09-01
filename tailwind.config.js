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
    screens: {
      'xs': '320px',
      'ty': '480px',
      'sm': '768px',
      'md': '992px',
      'lg': '1200px',
      'xl': '1400px',
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        'ty': '480px',
        'sm': '768px',
        'md': '860px',
        'lg': '1140px',
        'xl': '1300px',
      },
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

