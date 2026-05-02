import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6fdf4",
          100: "#e9f8e4",
          500: "#2f7d32",
          600: "#27692a",
          700: "#205723"
        }
      }
    }
  },
  plugins: []
};

export default config;
