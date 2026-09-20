import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          300: "#93b5fd",
          400: "#608ffa",
          500: "#3d68f5",
          600: "#2749e9",
          700: "#2038d3",
          800: "#2130aa",
          900: "#212d86",
        },
      },
    },
  },
  plugins: [],
};
export default config;
