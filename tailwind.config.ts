import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Oswald'],
        'sans': ['Roboto', 'sans-serif'],
      },
    },
 
  },
  plugins: [],
} satisfies Config;
