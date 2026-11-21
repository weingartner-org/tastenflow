import type { Config } from "tailwindcss";

/**
 * Apple-style design language. Colours are WCAG 2.1 AA verified against
 * the surfaces they sit on (body text >= 4.5:1, large/UI >= 3:1).
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Class-based: an explicit `.dark` on <html> drives the theme (system
  // default + manual toggle). All colours resolve to CSS variables that flip
  // under `.dark`, so even the imported Moodle HTML inherits correct contrast.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          raised: "rgb(var(--c-surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--c-surface-sunken) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          hover: "rgb(var(--c-accent-hover) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--c-success) / <alpha-value>)",
          soft: "rgb(var(--c-success-soft) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--c-warning) / <alpha-value>)",
          soft: "rgb(var(--c-warning-soft) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--c-danger) / <alpha-value>)",
          soft: "rgb(var(--c-danger-soft) / <alpha-value>)",
        },
        hairline: "rgb(var(--c-hairline) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        // Hochlesbare Schrift für den Tipptrainer (mitgeliefert, s. index.css).
        legible: [
          "Atkinson Hyperlegible",
          "-apple-system",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        raised: "0 4px 16px rgba(0,0,0,0.10)",
        focus: "0 0 0 4px rgba(0,102,204,0.35)",
      },
      maxWidth: {
        prose: "68ch",
        // Bildschirmbreite Laptop: vorher 920px (viel Whitespace), jetzt
        // 1200px — auf einem 1440-1920px-Display deutlich besser genutzt,
        // ohne ganz an den Rand zu kleben. Auf Mobile/Tablet greift die
        // max-Width nicht; dort zählt das geringe horizontale Padding.
        content: "1200px",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
