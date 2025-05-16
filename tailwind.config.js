/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#60A5FA'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          dark: '#A78BFA'
        },
        accent: {
          DEFAULT: '#8B5CF6',
          dark: '#A78BFA'
        },
        error: '#EF4444',
        warning: '#F59E0B',
        background: {
          DEFAULT: '#F3F4F6',
          dark: '#111827'
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2937'
        },
        text: {
          DEFAULT: '#1F2937',
          dark: '#F9FAFB',
          muted: '#6B7280',
          'muted-dark': '#9CA3AF'
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151'
        },
        muted: {
          DEFAULT: '#6B7280',
          dark: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
      },
      fontSize: {
        'h1': '2.25rem',
        'h2': '1.875rem',
        'h3': '1.5rem',
        'body': '1rem',
        'small': '0.875rem',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'card-dark': '0 4px 6px -1px rgb(0 0 0 / 0.5)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'entrance': 'cubic-bezier(0, 0, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
        'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      transitionDuration: {
        'quick': '150ms',
        'standard': '300ms',
        'complex': '500ms',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 