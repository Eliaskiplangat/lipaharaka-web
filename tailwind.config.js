/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stronger, friendlier green that reads as active and trustworthy.
        ink: {
          50: '#ECF9F6',
          100: '#D2F0EA',
          300: '#77D4BF',
          500: '#25A98B',
          700: '#0F7A66',
          900: '#0A554C',
        },
        // A warm supporting accent used sparingly, mostly for emphasis.
        gold: {
          100: '#F7E8C8',
          400: '#E1B25C',
          500: '#C99234',
          600: '#A96F1E',
        },
        paper: '#F4F8F6',
        line: '#D9E7E3',
        charcoal: '#152722',
        muted: '#60726D',
        danger: {
          100: '#FDE7E3',
          500: '#D95A3B',
          600: '#AC422D',
        },
        success: {
          100: '#E2F5E9',
          500: '#2D8E59',
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
