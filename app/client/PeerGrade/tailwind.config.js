/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
    ],
  theme: {
    extend: {
      maxHeight: {
        'taller-than-98': '35rem',
      },
      colors: {
        primary: {
          DEFAULT: '#1b2433',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#34D399',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#FBBF24',
          foreground: '#000000',
        },
        background: {
          DEFAULT: "#FFFFFF", // Slate color
          foreground: "#1C232E"
        },
        muted: {
          DEFAULT: "#b0bec5", // Slate color
          foreground: "#758196"
        },
        popover: {
          DEFAULT: "#f5f5f5", // Slate color
          foreground: "#1C232E"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C232E"
        },
        accent: {
          DEFAULT: "#cfd8dc", // Slate color
          foreground: "#1C232E"
        },
        secondary: {
          DEFAULT: "#e0e7ff", // Soft Indigo color
          foreground: "#1C232E"
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          foreground: '#ffffff',
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
