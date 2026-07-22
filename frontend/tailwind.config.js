/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        impala: {
          brown: '#8B5E3C',
          'brown-light': '#A67B5A',
          'brown-dark': '#6B4527',
          sand: '#F5E6D3',
          'sand-light': '#FAF0E6',
          'sand-dark': '#E8D5BC',
          ivory: '#FFF8F0',
          'ivory-dark': '#F5EDE0',
          charcoal: '#2C2C2C',
          'charcoal-light': '#4A4A4A',
          'charcoal-muted': '#6B6B6B',
          green: '#5B8C5A',
          'green-light': '#7DAF7C',
          'green-dark': '#3D6B3C',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
