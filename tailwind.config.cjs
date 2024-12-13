/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
      plugin(function ({ addUtilities }) {
        addUtilities({
          '.text-stroke-black': {
            '-webkit-text-stroke': '0.5px black', /* Default stroke */
          },
          '.text-stroke-white': {
            '-webkit-text-stroke': '0.5px white', /* Default stroke */
          },
        });
      }),
  ],
}