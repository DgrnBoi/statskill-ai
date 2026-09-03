/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0B2E63', // Deep Navy / Header bg
          700: '#123E82',
          500: '#1A56A0', // Karmayogi Blue / Links
          100: '#E5EEF8', // Light background
          DEFAULT: '#0B2E63',
        },
        accent: {
          saffron: '#F5811F', // Primary CTA
          'saffron-light': '#FDE8D2',
          green: '#1E8449', // Success/Completion
          gold: '#C9A227', // Karma Points
        },
        neutral: {
          900: '#1C1C1E', // Body Text
          700: '#4A4A4A', // Secondary Text
          400: '#9B9B9B', // Disabled / Placeholder
          200: '#E2E2E2', // Borders
          100: '#F5F6F8', // Section Bg
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Noto Sans', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.08)',
        'elevated': '0 4px 12px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background-color': '#FFFFFF',
          'border': '1px solid #E2E2E2',
          'box-shadow': '0 1px 4px rgba(0,0,0,0.08)',
          'border-radius': '12px'
        },
        '.badge': {
          'padding': '4px 12px',
          'border-radius': '999px',
          'font-size': '12px',
          'font-weight': '600',
        },
        '.badge-new': {
          'background-color': '#FDE8D2',
          'color': '#9A4A0C'
        },
        '.badge-done': {
          'background-color': '#E4F3EA',
          'color': '#1E8449'
        }
      });
    }
  ],
}
