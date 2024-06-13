// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b2433', // Update with your primary color
          foreground: '#FFFFFF', // Update with your primary foreground color
        },
        destructive: {
          DEFAULT: '#DC2626', // Update with your destructive color
          foreground: '#FFFFFF', // Update with your destructive foreground color
        },
        success: {
          DEFAULT: '#34D399', // Light green
          foreground: '#FFFFFF', // White foreground color
        },
        warning: {
          DEFAULT: '#FBBF24', // Light yellow
          foreground: '#000000', // Black foreground color
        },
        colored: {
          DEFAULT: '#00d1b9', // teal
          foreground: '#000000', // Black foreground color
        },
        // Add other custom colors if needed
      },
    },
  },
  plugins: [],
}
