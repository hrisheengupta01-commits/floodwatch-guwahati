/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef4fb",
          100: "#d9e6f6",
          200: "#b4ccec",
          300: "#84aade",
          400: "#5183cb",
          500: "#3064b5",
          600: "#214d96",
          700: "#1b3f7a",
          800: "#173565",
          900: "#122a4f",
          950: "#0b1b33",
        },
        water: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.45)" },
          "100%": { boxShadow: "0 0 0 12px rgba(34, 211, 238, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
