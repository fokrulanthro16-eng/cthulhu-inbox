import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#020403",
          900: "#040a06",
          850: "#07130a",
          800: "#0b1c10",
        },
        phosphor: {
          dim: "#00471b",
          dark: "#006b29",
          base: "#00ff66",
          bright: "#5cff95",
          laser: "#80ffaa",
          glow: "rgba(0, 255, 102, 0.4)",
        },
        eldritch: {
          blood: "#ff2244",
          bloodGlow: "rgba(255, 34, 68, 0.5)",
          amber: "#ffaa00",
          amberGlow: "rgba(255, 170, 0, 0.4)",
          purple: "#9d4edd",
          purpleGlow: "rgba(157, 78, 221, 0.4)",
        },
      },
      fontFamily: {
        mono: [
          "'Courier New'",
          "Courier",
          "Consolas",
          "'Lucida Console'",
          "monospace",
        ],
      },
      boxShadow: {
        phosphor: "0 0 15px rgba(0, 255, 102, 0.4), inset 0 0 15px rgba(0, 255, 102, 0.15)",
        "phosphor-bright": "0 0 25px rgba(0, 255, 102, 0.7), inset 0 0 25px rgba(0, 255, 102, 0.3)",
        blood: "0 0 20px rgba(255, 34, 68, 0.6), inset 0 0 15px rgba(255, 34, 68, 0.2)",
        amber: "0 0 15px rgba(255, 170, 0, 0.4), inset 0 0 15px rgba(255, 170, 0, 0.15)",
        crt: "inset 0 0 100px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 255, 102, 0.15)",
      },
      textShadow: {
        phosphor: "0 0 8px rgba(0, 255, 102, 0.8)",
        blood: "0 0 8px rgba(255, 34, 68, 0.8)",
        amber: "0 0 8px rgba(255, 170, 0, 0.8)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.98" },
          "50%": { opacity: "1" },
          "70%": { opacity: "0.96" },
          "85%": { opacity: "0.99" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        screenShake: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "10%": { transform: "translate(-3px, 2px) rotate(-0.5deg)" },
          "20%": { transform: "translate(3px, -2px) rotate(0.5deg)" },
          "30%": { transform: "translate(-4px, -1px) rotate(-0.3deg)" },
          "40%": { transform: "translate(4px, 2px) rotate(0.3deg)" },
          "50%": { transform: "translate(-2px, 3px) rotate(-0.2deg)" },
          "60%": { transform: "translate(3px, 1px) rotate(0.4deg)" },
          "70%": { transform: "translate(-3px, -2px) rotate(-0.5deg)" },
          "80%": { transform: "translate(2px, -3px) rotate(0.3deg)" },
          "90%": { transform: "translate(-1px, 2px) rotate(-0.2deg)" },
        },
        glitch: {
          "0%, 100%": { transform: "none", opacity: "1" },
          "7%": { transform: "skew(-0.8deg, -1deg)", opacity: "0.85" },
          "10%": { transform: "none", opacity: "1" },
          "27%": { transform: "none", opacity: "1" },
          "30%": { transform: "skew(1deg, 0.6deg)", opacity: "0.75" },
          "35%": { transform: "none", opacity: "1" },
          "52%": { transform: "none", opacity: "1" },
          "55%": { transform: "skew(-1.5deg, 0.8deg)", opacity: "0.6" },
          "56%": { transform: "none", opacity: "1" },
          "78%": { transform: "none", opacity: "1" },
          "80%": { transform: "skew(0.6deg, -0.4deg)", opacity: "0.8" },
          "83%": { transform: "none", opacity: "1" },
        },
      },
      animation: {
        flicker: "flicker 0.15s infinite",
        scanline: "scanline 8s linear infinite",
        "screen-shake": "screenShake 0.15s ease-in-out infinite",
        shake: "screenShake 0.15s ease-in-out infinite",
        glitch: "glitch 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
