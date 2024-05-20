import type { Config } from "tailwindcss";

const config: Config = {
 content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
 ],
 theme: {
  extend: {
   colors: {
    ransparent: "transparent",
    current: "currentColor",
    text: "#190019",
    backgroundDark: "#854f6c",
    backgroundLight: "#fbe4d8",
    primary: "#dfb6b2",
    secondary: "#2b124c",
    accent: "#522b5b",
   },
   backgroundImage: {
    "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
    "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
   },
   animation: {
    hoverPop: "hoverPop 0.6s forwards",
   },
   keyframes: {
    hoverPop: {
     "0%, 100%": { transform: "scale(1)" },
     "33%": { transform: "scale(1.05)" },
     "66%": { transform: "scale(0.85)" },
    },
   },
  },
 },
 plugins: [],
};

export default config;
