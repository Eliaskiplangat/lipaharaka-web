/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep teal-ink: the brand's primary color. Money/growth-coded without being a
        // literal M-Pesa-green clone.
        ink: {
          50: '#EAF1F0',
          100: '#CFE0DE',
          300: '#6E9C97',
          500: '#2C6B65',
          700: '#0F3D3E',
          900: '#0A2726',
        },
        // Warm gold: the single accent color, used sparingly for calls-to-action and
        // the one highlighted number on a screen.
        gold: {
          100: '#F3E3C2',
          400: '#D9A441',
          500: '#C68A2E',
          600: '#A66F1F',
        },
        paper: '#F7F6F2',
        line: '#DEDACF',
        charcoal: '#191B1A',
        muted: '#6B6960',
        danger: {
          100: '#F3DCD3',
          500: '#B5432B',
          600: '#8F3220',
        },
        success: {
          100: '#DCEADB',
          500: '#2F7D52',
        },
      },
      fontFamily: {
        // Fraunces is reserved specifically for money amounts and KPI numbers — a
        // deliberate ledger-like treatment, not a general display font.
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '3px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
