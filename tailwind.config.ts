import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)", ...defaultTheme.fontFamily.sans],
        heading: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: "#111827",
            a: {
              color: "#0369a1",
              textDecoration: "none",
              fontWeight: "500",
              '&:hover': { textDecoration: "underline" },
            },
            h1: {
              fontFamily: "var(--font-montserrat)",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              fontSize: "2rem",
            },
            h2: {
              fontFamily: "var(--font-montserrat)",
              fontWeight: "700",
              letterSpacing: "-0.01em",
              lineHeight: "1.25",
              fontSize: "1.5rem",
              marginTop: "1.75em",
              marginBottom: "0.75em",
            },
            h3: {
              fontFamily: "var(--font-montserrat)",
              fontWeight: "600",
              lineHeight: "1.3",
              fontSize: "1.25rem",
            },
            p: { lineHeight: "1.75" },
            img: { borderRadius: "0.75rem" },
            blockquote: {
              fontStyle: "normal",
              color: "#334155",
              borderLeftColor: "#e5e7eb",
            },
            code: { backgroundColor: "#f1f5f9", padding: "0.2em 0.35em", borderRadius: "0.375rem" },
            /* Tablas profesionales */
            table: {
              display: "table",
              width: "100%",
              tableLayout: "auto",
              borderRadius: theme("borderRadius.xl"),
              boxShadow: theme("boxShadow.xl"),
              borderCollapse: "separate",
              borderSpacing: 0,
            },
            thead: {
              backgroundColor: "#f8fafc",
            },
            "thead th": {
              position: "relative",
              fontFamily: "var(--font-montserrat)",
              fontWeight: "700",
              letterSpacing: "0.01em",
              padding: "0.875rem 1rem",
              color: "#0f172a",
              backgroundColor: "#f8fafc",
            },
            "thead th, tbody td": {
              whiteSpace: "normal",
              wordBreak: "normal",
              overflowWrap: "anywhere",
            },
            "tbody tr": {
              transition: "background-color .2s ease",
            },
            "tbody tr:nth-child(odd)": {
              backgroundColor: "#fcfcfd",
            },
            "tbody tr:hover": {
              backgroundColor: "#f1f5f9",
            },
            "tbody td": {
              padding: "0.875rem 1rem",
              borderTop: `1px solid ${theme("colors.gray.200")}`,
              whiteSpace: "normal",
              wordBreak: "normal",
              overflowWrap: "anywhere",
            },
          },
        },
        invert: {
          css: {
            color: theme("colors.slate.200"),
            a: { color: theme("colors.sky.300") },
            code: { backgroundColor: theme("colors.slate.800") },
            blockquote: {
              color: theme("colors.slate.300"),
              borderLeftColor: theme("colors.slate.700"),
            },
            table: {
              boxShadow: theme("boxShadow.lg"),
              borderRadius: theme("borderRadius.xl"),
            },
            thead: { backgroundColor: theme("colors.slate.800") },
            "thead th": {
              color: theme("colors.slate.100"),
              backgroundColor: theme("colors.slate.800"),
            },
            "tbody tr:nth-child(odd)": { backgroundColor: theme("colors.slate.900") },
            "tbody tr:hover": { backgroundColor: theme("colors.slate.800") },
            "tbody td": { borderTop: `1px solid ${theme("colors.slate.700")}` },
          },
        },
        lg: {
          css: {
            h1: { fontSize: "2.5rem" },
            h2: { fontSize: "2rem" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
