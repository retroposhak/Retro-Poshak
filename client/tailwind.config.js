/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f5f0e8', // Original
          50: '#fbf8f3',
          100: '#f5f0e8',
          200: '#ece3d1',
          300: '#e0d2b8',
          400: '#d8c9ac',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#3a3530',
          mute: '#7a7a7a',
        },
        red: {
          DEFAULT: '#b33a3a',
          dark: '#8f2e2e',
          soft: '#d46565',
        },
        green: {
          DEFAULT: '#2c7a4a',
          soft: '#4b9c68',
        },
        gold: {
          DEFAULT: '#c9a14a',
          soft: '#e0c37a',
        },
        // NEW: From the reference images
        darkbrown: {
          DEFAULT: '#1a1614',
          100: '#2c2622',
          200: '#3d342e',
        },
        goldline: '#b88645',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cond: ['Oswald', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(26, 26, 26, 0.06)',
        card: '0 20px 60px rgba(0, 0, 0, 0.08)',
        lift: '0 14px 30px rgba(179, 58, 58, 0.18)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        pill: '999px',
        card: '20px',
        soft: '14px',
        chip: '8px',
      },
      letterSpacing: {
        wide2: '0.18em',
        wide3: '0.32em',
      },
      backgroundImage: {
        'cream-radial': 'radial-gradient(circle at 30% 20%, #fbf8f3 0%, #f5f0e8 45%, #ece3d1 100%)',
        grain: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.05'/></svg>\")",
      },
      keyframes: {
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'progress-fill': 'progressFill 4s linear infinite',
        marquee: 'marquee 40s linear infinite',
        'fade-up': 'fadeUp 0.5s ease both',
        'pop-in': 'popIn 0.5s ease',
      },
    },
  },
  plugins: [],
};