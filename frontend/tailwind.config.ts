import { defineConfig } from 'windicss/helpers'
// import formsPlugin from 'windicss/plugin/forms'
import plugin from 'windicss/plugin'

export default defineConfig({
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096'
        }
      }
    }
  },
  plugins: [
    // plugin(({ addUtilities }) => {
    //   const newUtilities = {
    //     '.skew-10deg': {
    //       transform: 'skewY(-10deg)',
    //     },
    //     '.skew-15deg': {
    //       transform: 'skewY(-15deg)',
    //     },
    //   }
    //   addUtilities(newUtilities)
    // }),
    // plugin(({ addComponents }) => {
    //   const buttons = {
    //     '.btn': {
    //       padding: '.5rem 1rem',
    //       borderRadius: '.25rem',
    //       fontWeight: '600',
    //     },
    //     '.btn-blue': {
    //       'backgroundColor': '#3490dc',
    //       'color': '#fff',
    //       '&:hover': {
    //         backgroundColor: '#2779bd',
    //       },
    //     },
    //     '.btn-red': {
    //       'backgroundColor': '#e3342f',
    //       'color': '#fff',
    //       '&:hover': {
    //         backgroundColor: '#cc1f1a',
    //       },
    //     },
    //   }
    //   addComponents(buttons)
    // }),
    plugin(({ addDynamic, variants }) => {
      addDynamic('max-width', ({ Utility }) => {
        return Utility.handler
          .handleNumber(0, 130, 'int', number => `${number}rem`)
          .createProperty('max-width')
      }, {
        group: 'max-width',
        completions: [
          'max-width-{int}',
        ],
        variants: variants('max-width')
      })
    }),
  ],
})
