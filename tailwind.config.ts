import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "760px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bg: "#16130F",
        surface: "#1A1611",
        "surface-2": "#201B15",
        "surface-3": "#2B241C",
        text: "#F5F1EA",
        "text-muted": "#A69C8D",
        "text-dim": "#6B6154",
        "text-soft": "#D8C3AD",
        accent: "#FF7A3D",
        "accent-hover": "#FF9560",
        success: "#B6E24A",
        "split-push": "#FF7A3D",
        "split-pull": "#4F8BFF",
        "split-legs": "#B6E24A",
        "split-upper": "#23D3C4",
        "split-lower": "#B57BFF",
        "split-full": "#FF5C86",
        "phone-bezel": "#0A0908",
        "phone-ring": "#2B2620",
        ink: "#1A0F06",
        day: "#4A4438",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-hanken)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "phone-glow":
          "radial-gradient(circle, rgba(255,122,61,.15), transparent 70%)",
        "warm-card":
          "linear-gradient(155deg, #5A2A12, #301A10 78%)",
        reroute: "linear-gradient(120deg, #3A2415, #241B13)",
      },
      boxShadow: {
        phone:
          "0 50px 100px -34px rgba(0,0,0,.85), 0 0 0 2px #2B2620",
        "accent-button": "0 16px 40px -14px rgba(255,122,61,.6)",
        "accent-card": "0 16px 36px -18px rgba(255,122,61,.6)",
        "accent-row": "0 12px 30px -16px rgba(255,122,61,.5)",
        "warm-card": "0 0 0 5px rgba(255,122,61,.06)",
        chip: "0 10px 24px -18px rgba(0,0,0,.7)",
        "split-push": "0 8px 18px -8px #FF7A3D",
        "split-pull": "0 8px 18px -8px #4F8BFF",
        "split-legs": "0 8px 18px -8px #B6E24A",
        "split-upper": "0 8px 18px -8px #23D3C4",
        "split-lower": "0 8px 18px -8px #B57BFF",
        "split-full": "0 8px 18px -8px #FF5C86",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        breathe: {
          "0%, 100%": { opacity: ".5" },
          "50%": { opacity: "1" },
        },
        restpulse: {
          "0%": { transform: "scale(1)", opacity: ".9" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        arrowdrift: {
          "0%, 100%": { transform: "translateY(0)", opacity: ".5" },
          "50%": { transform: "translateY(4px)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
        restpulse: "restpulse 2.4s ease-out infinite",
        arrowdrift: "arrowdrift 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        stack: "cubic-bezier(.2,.7,.2,1)",
      },
      transitionDuration: {
        "850": "850ms",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
