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
          DEFAULT: "#FFFFFF",
          foreground: "#1C232E"
        },
        muted: {
          DEFAULT: "#F4F8FB",
          foreground: "#758196"
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C232E"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C232E"
        },
        accent: {
          DEFAULT: "#F4F8FB",
          foreground: "#1C232E"
        },
        secondary: {
          DEFAULT: "#F4F8FB",
          foreground: "#1C232E"
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
