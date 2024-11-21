/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          dark: "var(--primary-dark)",
        },
        secondary: "var(--secondary-color)",
        "bg-light": "var(--bg-light)",
        "bg-gray": "var(--bg-gray)",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
