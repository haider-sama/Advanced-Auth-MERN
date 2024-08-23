/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#212121"
      }
    },
    container: {
      padding: {
        md: "10rem",
      },
    },
  },
  plugins: [],
};