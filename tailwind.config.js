/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF385C',
        secondary: '#00A699',
        dark: {
          text: {
            primary: '#E4E6EB',    // Light gray for primary text
            secondary: '#B0B3B8',  // Slightly darker gray for secondary text
            muted: '#8A8D91'       // Even darker gray for muted text
          },
          bg: {
            primary: '#18191A',    // Dark background
            secondary: '#242526',  // Slightly lighter background
            elevated: '#3A3B3C'    // Elevated components background
          }
        }
      },
    },
  },
  plugins: [],
};