/* eslint-disable global-require */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    textIndent: (theme, { negative }) => ({
      ...{
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
      },
      ...negative({
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
      }),
    }),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      purple: colors.violet,
      pink: colors.pink,
      gray: {
        50: '#fafafa',
        100: '#f4f4f4',
        200: '#e7e7e7',
        300: '#d5d5d5',
        400: '#a3a3a3',
        500: '#727272',
        600: '#555555',
        700: '#414141',
        800: '#292929',
        900: '#181818',
      },
      // ...
    },
    extend: {
      backgroundImage: {
        'arrow-right':
          // "linear-gradient(to right bottom, rgba('#7ed56f',0.8), rgba('#28b485',0.8)), url('https://i.imgur.com/BrHtQOP.png')",
          'url(https://i.imgur.com/BrHtQOP.png)',
        'arrow-down': 'url(https://i.imgur.com/cDqlXqC.png)',
        'folder-black': 'url(https://i.imgur.com/AgiQS6D.png)',
        'folder-white': 'url(https://i.imgur.com/5KqFuPf.png)',
        'file-black': 'url(https://i.imgur.com/SqhUexF.png)',
        'file-white': 'url(https://i.imgur.com/IURRD7F.png)',
      },
    },
  },
  variants: {
    textIndent: ['responsive'],
    extend: {
      backgroundImage: ['hover', 'focus'],
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwindcss-text-indent')(), // no options to configure
    /* eslint-enable global-require */
  ],
};
