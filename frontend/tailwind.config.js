/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "kitty-dark": "#1a1a2e",
        "kitty-mid": "#16213e",
        "kitty-card": "#0f3460",
        "kitty-accent": "#e94560",
        "kitty-purple": "#533483",
        "kitty-gold": "#f5a623",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
