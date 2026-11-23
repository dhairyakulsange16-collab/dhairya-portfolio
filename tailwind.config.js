/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#030712",
          deep: "#050B2E",
          canvas: "#02040A",
        },
        surface: {
          DEFAULT: "rgba(5, 11, 46, 0.65)",
          elevated: "rgba(10, 20, 70, 0.5)",
          border: "rgba(34, 211, 238, 0.15)",
          hover: "rgba(34, 211, 238, 0.25)",
        },
        primary: {
          DEFAULT: "#1E5BFF", // Electric Blue
          glow: "rgba(30, 91, 255, 0.35)",
          hover: "#3B73FF",
        },
        accent: {
          DEFAULT: "#22D3EE", // Neon Cyan
          glow: "rgba(34, 211, 238, 0.4)",
          bright: "#5CF0FF",
          muted: "rgba(34, 211, 238, 0.12)",
        },
        muted: {
          text: "#9AA8C7", // Soft Gray-Blue
          border: "rgba(154, 168, 199, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "streak-move": "streakMove 12s linear infinite",
        "marquee-train": "marqueeTrain var(--marquee-duration, 35s) linear infinite",
        "marquee-train-reverse": "marqueeTrainReverse var(--marquee-duration-reverse, 42s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        streakMove: {
          "0%": { transform: "translateX(-100%) translateY(-100%) rotate(-45deg)" },
          "100%": { transform: "translateX(200%) translateY(200%) rotate(-45deg)" },
        },
        marqueeTrain: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        marqueeTrainReverse: {
          "0%": { transform: "translate3d(-50%, 0, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
