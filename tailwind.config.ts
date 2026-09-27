import type { Config } from "tailwindcss";

/**
 * TrustedSkills design tokens.
 *
 * The rule this file exists to enforce: nothing in the UI picks a raw Tailwind
 * palette colour. Surfaces, borders and text come from `ink`; interactive
 * affordance comes from `accent`; meaning comes from `ok` / `warn` / `risk`.
 *
 * The palette is deliberately near-monochrome. A registry page is 95% dense
 * text and metadata, so colour is reserved for the few things that carry
 * meaning — which is also what stops it reading as a generated landing page.
 */

const ink = {
  // canvas → surfaces
  1000: "#060709",
  950: "#0a0b0e",
  900: "#0f1115",
  850: "#14161b",
  800: "#191c22",
  // borders / dividers
  750: "#20242c",
  700: "#282d36",
  650: "#333944",
  // text
  600: "#454c59",
  500: "#5f6775",
  450: "#767f8d",
  400: "#8d96a4",
  300: "#aeb6c2",
  200: "#ccd2da",
  100: "#e5e9ee",
  50: "#f5f7f9",
};

// Interactive affordance. A plain azure: it reads as "link / infrastructure"
// rather than as a brand gradient, and it is the one hue that never competes
// with the semantic chips.
const accent = {
  950: "#061a2e",
  900: "#0a2947",
  800: "#0d3b68",
  700: "#12508e",
  600: "#1668b8",
  500: "#2186e0",
  400: "#4ea6f5",
  300: "#82c3fa",
  200: "#b4dcfd",
};

const ok = {
  950: "#052016",
  900: "#06301f",
  800: "#08492e",
  700: "#0c6b42",
  600: "#10935b",
  500: "#18b976",
  400: "#3ed394",
  300: "#79e6b8",
};

const warn = {
  950: "#241603",
  900: "#3a2305",
  800: "#573608",
  700: "#7d4e0a",
  600: "#a86a0c",
  500: "#d18b12",
  400: "#eaa93a",
  300: "#f5c877",
};

const risk = {
  950: "#2a0810",
  900: "#420c19",
  800: "#631224",
  700: "#8c1a33",
  600: "#b82545",
  500: "#dc3a5d",
  400: "#ef6a86",
  300: "#f79bad",
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink,
        accent,
        ok,
        warn,
        risk,
        // Semantic aliases — prefer these in components over raw steps.
        canvas: ink[1000],
        surface: ink[900],
        "surface-raised": ink[850],
        hairline: ink[750],
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },

      /**
       * Type scale. Each step carries its own line-height and tracking so a
       * component only ever picks one class. Optical tracking tightens as size
       * grows — the thing hand-built type scales do and generated ones don't.
       */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.01em" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem", letterSpacing: "0.005em" }],
        base: ["0.9375rem", { lineHeight: "1.5rem", letterSpacing: "0em" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem", letterSpacing: "-0.006em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.012em" }],
        "2xl": ["1.5rem", { lineHeight: "1.9375rem", letterSpacing: "-0.018em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.022em" }],
        "4xl": ["2.375rem", { lineHeight: "2.625rem", letterSpacing: "-0.027em" }],
        "5xl": ["3rem", { lineHeight: "3.1875rem", letterSpacing: "-0.032em" }],
        "6xl": ["3.75rem", { lineHeight: "3.875rem", letterSpacing: "-0.036em" }],
      },

      /**
       * Spacing rhythm. Tailwind's 4px grid stays; these are the named steps
       * the layout actually repeats, so section padding stops being ad hoc.
       */
      spacing: {
        gutter: "1.25rem", // inner padding of a card
        "gutter-lg": "1.75rem", // inner padding of a panel
        stack: "0.75rem", // gap between related rows
        "stack-lg": "1.25rem", // gap between blocks in a card
        section: "4rem", // gap between page sections
        "section-lg": "6rem",
        18: "4.5rem",
        22: "5.5rem",
      },

      borderRadius: {
        xs: "3px",
        sm: "5px",
        DEFAULT: "7px",
        md: "9px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },

      /**
       * Elevation. On a near-black canvas a drop shadow alone is invisible, so
       * each step pairs a shadow with a 1px top inner highlight — the way real
       * dark UIs suggest a raised surface.
       */
      boxShadow: {
        e1: "0 1px 2px 0 rgb(0 0 0 / 0.4), inset 0 1px 0 0 rgb(255 255 255 / 0.03)",
        e2: "0 2px 6px -1px rgb(0 0 0 / 0.5), 0 1px 2px rgb(0 0 0 / 0.4), inset 0 1px 0 0 rgb(255 255 255 / 0.04)",
        e3: "0 10px 28px -10px rgb(0 0 0 / 0.65), 0 2px 6px rgb(0 0 0 / 0.4), inset 0 1px 0 0 rgb(255 255 255 / 0.05)",
        e4: "0 28px 72px -20px rgb(0 0 0 / 0.75), inset 0 1px 0 0 rgb(255 255 255 / 0.06)",
        hairline: "inset 0 0 0 1px rgb(255 255 255 / 0.05)",
        focus: `0 0 0 2px ${ink[1000]}, 0 0 0 4px ${accent[500]}`,
      },

      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        DEFAULT: "160ms",
        slow: "260ms",
      },

      maxWidth: {
        page: "80rem", // the 7xl container every surface shares
        prose: "42rem",
      },

      backgroundImage: {
        // A single 1px grid, used at very low opacity as page texture. This is
        // the only decorative background in the system — it replaces the
        // blurred colour glow it was brought in to kill.
        grid: `linear-gradient(to right, ${ink[750]} 1px, transparent 1px), linear-gradient(to bottom, ${ink[750]} 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: "56px 56px",
      },
    },
  },
  plugins: [],
};

export default config;
