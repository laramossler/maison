/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF7',
        champagne: '#FBF8F1',
        ink: '#1A1A2E',
        gold: '#B8963E',
        'gold-light': '#D4B86A',
        'warm-gray': '#6B6B7B',
        'rule': '#E8E4DC',
        'rule-light': '#F0EDE6',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Lora"', 'serif'],
        sans: ['"Jost"', 'sans-serif'],
      },
      maxWidth: {
        'page': '640px',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
      },
      letterSpacing: {
        'display': '0.04em',
        'label': '0.12em',
      },
    },
  },
  plugins: [],
}
