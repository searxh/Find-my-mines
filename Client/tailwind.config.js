module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      '2xs': '.625rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      fontFamily:{
        'quicksand':'Quicksand',
        'righteous':'Righteous'
      },
      animation:{
        'pulse-slow': 'pulse 5s ease-in-out infinite',
        'spin-slow': 'spin 50s infinite',
        'pulse-ultra-slow': 'pulse 20s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}