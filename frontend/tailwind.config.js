/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#0a0a0f",
          900: "#0f0f1a",
          800: "#15151f",
          700: "#1c1c2e",
          600: "#252540",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
        ui: ["'Rajdhani'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
