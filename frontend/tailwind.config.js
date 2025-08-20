/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ['Lato'],
      },

      colors: {
        'orange': '#ff7e1d'
      },

      scale: {
       '102': '1.02',
      }

    },

    

  },
  variants: {
    extend: {},
  },
  plugins: [],
}


