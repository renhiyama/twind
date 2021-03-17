import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { makeThemeResolver } from '../twind/theme'

const test = suite('theme')

test('no custom theme', () => {
  const theme = makeThemeResolver()

  assert.is(theme('borderColor', []), '#e5e7eb')
})

test('default color', () => {
  const theme = makeThemeResolver({
    extend: {
      colors: {
        gray: {
          DEFAULT: '#aaa',
        },
      },
    },
  })

  assert.is(theme('borderColor', 'gray'), '#aaa')
})

test('custom color', () => {
  const theme = makeThemeResolver({
    extend: {
      colors: {
        gray: {
          custom: '#aaa',
        },
      },
    },
  })

  assert.is(theme('borderColor.gray.custom'), '#aaa')
  assert.is(theme('borderColor', 'gray.custom'), '#aaa')
  assert.is(theme('borderColor', 'gray-custom'), '#aaa')
  assert.is(theme('borderColor', ['gray', 'custom']), '#aaa')

  assert.is(theme('borderColor.gray.300'), '#d1d5db')
  assert.is(theme('borderColor', 'gray.300'), '#d1d5db')
  assert.is(theme('borderColor', 'gray-300'), '#d1d5db')
  assert.is(theme('borderColor', ['gray', '300']), '#d1d5db')

  assert.is(theme('borderColor.gray.special', '#bbb'), '#bbb')
  assert.is(theme('borderColor', 'gray.special', '#bbb'), '#bbb')
  assert.is(theme('borderColor', 'gray-special', '#bbb'), '#bbb')
  assert.is(theme('borderColor', ['gray', 'special'], '#bbb'), '#bbb')
})

test('deep custom color', () => {
  const theme = makeThemeResolver({
    extend: {
      colors: {
        gray: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: '#abcdef',
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  assert.is(theme('colors', 'gray.a.b.c.d.e.f'), '#abcdef')
  assert.is(theme('colors', 'gray-a-b-c-d-e-f'), '#abcdef')
  assert.is(theme('colors', ['gray', 'a', 'b', 'c', 'd', 'e', 'f']), '#abcdef')

  assert.is(theme('colors', 'gray.300'), '#d1d5db')
  assert.is(theme('colors', 'gray-300'), '#d1d5db')
  assert.is(theme('colors', ['gray', '300']), '#d1d5db')
})

test('negative is available and no-op', () => {
  const theme = makeThemeResolver({
    extend: {
      spacing: (theme, { negative }) => ({
        ...negative({ xs: '1rem' }),
      }),
    },
  })

  assert.is(theme('spacing', 'xs'), undefined)
  assert.is(theme('spacing', '-xs'), undefined)

  assert.is(theme('spacing', 'px'), '1px')
})

test('reference the default theme', () => {
  const theme = makeThemeResolver({
    extend: {
      fontFamily: (theme) => ({
        sans: ['"Inter var"', theme('fontFamily.sans') as string],
      }),
    },
  })

  assert.is(
    theme('fontFamily', 'sans'),
    '"Inter var",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  )
})

test.run()
