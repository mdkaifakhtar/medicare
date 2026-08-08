/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0fdf5',
          100: '#d4f5e4',
          200: '#aaeacc',
          300: '#6dd8ab',
          400: '#3dbf87',
          500: '#2aa870',
          600: '#1f8a5a',
          700: '#1a6f48',
          800: '#175939',
          900: '#13492e',
          950: '#092a1b',
        },
        // The sidebar deep healthcare green
        'sidebar': '#12603F',
        // Hero right panel mint
        'hero-mint': '#C5EDD4',
        secondary: {
          50:  '#f0fdf5', 100: '#d4f5e4', 200: '#aaeacc',
          300: '#6dd8ab', 400: '#3dbf87', 500: '#2aa870',
          600: '#1f8a5a', 700: '#1a6f48', 800: '#175939', 900: '#13492e',
        },
        accent: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        },
        success: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706',
        },
        error: {
          50: '#fef2f2', 100: '#fee2e2', 400: '#f87171', 500: '#ef4444', 600: '#dc2626',
        },
        neutral: {
          50:  '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
          400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
          800: '#1f2937', 900: '#111827', 950: '#030712',
        },
      },
      borderRadius: {
        '4xl': '2rem', '5xl': '2.5rem', '6xl': '3rem',
      },
      boxShadow: {
        'card':    '0 2px 8px -1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg': '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'hero':    '0 20px 60px -12px rgba(0,0,0,0.12)',
        'glow':    '0 0 20px rgba(44,168,112,0.3)',
        'inner-sm':'inset 0 1px 2px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'fade-up':   { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'scale-in':  { '0%': { opacity: 0, transform: 'scale(0.97)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        'shimmer':   { '100%': { transform: 'translateX(100%)' } },
        'float':     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        'fade-up':  'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':  'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer':  'shimmer 1.8s infinite',
        'float':    'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
