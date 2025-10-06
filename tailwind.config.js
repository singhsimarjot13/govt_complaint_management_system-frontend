/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'punjab-indigo': '#0E4A63',
        'punjab-mustard': '#F6C85F',
        'punjab-green': '#1E8B57',
        'punjab-white': '#FFFFFF',
        'punjab-red': '#C72C48',
        'punjab-indigo-light': '#1a6b7a',
        'punjab-mustard-light': '#f8d47a',
        'punjab-green-light': '#2ba66a',
        'punjab-red-light': '#d94a5c',
      },
      fontFamily: {
        'punjabi': ['Noto Sans Gurmukhi', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
