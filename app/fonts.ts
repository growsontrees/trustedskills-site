import localFont from "next/font/local";

// Self-hosted so the build needs no network beyond npm, and so the browser
// makes no third-party request. Both files are variable (wght axis), latin
// subset — ~48 KB and ~40 KB.

export const sans = localFont({
  src: "./fonts/Inter.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const mono = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});
