import {
  EMPTY_ARRAY_STRING,
  parseQueryStateValue,
  toQueryStateValue,
} from '../src/query-state-core'

describe.each`
  value                 | defaultValue  | parsedValue
  ${EMPTY_ARRAY_STRING} | ${['abc']}    | ${[]}
  ${EMPTY_ARRAY_STRING} | ${['']}       | ${[]}
  ${EMPTY_ARRAY_STRING} | ${[]}         | ${[]}
  ${''}                 | ${[]}         | ${['']}
  ${undefined}          | ${''}         | ${null}
  ${'0'}                | ${0}          | ${0}
  ${'0'}                | ${100}        | ${0}
  ${'true'}             | ${false}      | ${true}
  ${'true'}             | ${true}       | ${true}
  ${'false'}            | ${false}      | ${false}
  ${'false'}            | ${true}       | ${false}
  ${'Text'}             | ${true}       | ${null}
  ${'Text, Text'}       | ${'Text'}     | ${'Text, Text'}
  ${'2019-01-01'}       | ${new Date()} | ${new Date('2019-01-01')}
  ${'xxx'}              | ${new Date()} | ${null}
  ${() => void 0}       | ${'Text'}     | ${null}
`(
  'parseQueryStateValue value $value, defaultValue $defaultValue',
  ({ value, defaultValue, parsedValue }) => {
    test(`should return value transformed into correct type or null (invalid transform)`, () => {
      expect(parseQueryStateValue(value, defaultValue)).toEqual(parsedValue)
    })
  }
)

describe.each`
  value                     | stateValue
  ${'Text'}                 | ${'Text'}
  ${10}                     | ${'10'}
  ${NaN}                    | ${null}
  ${true}                   | ${'true'}
  ${false}                  | ${'false'}
  ${[]}                     | ${[]}
  ${['Text']}               | ${['Text']}
  ${['Just', 'Text']}       | ${['Just', 'Text']}
  ${Symbol('Any')}          | ${null}
  ${new Date('2019-01-01')} | ${'2019-01-01T00:00:00.000Z'}
  ${new Date('xxx')}        | ${null}
`('toQueryStateValue value $value, stateValue $stateValue', ({ value, stateValue }) => {
  test(`should return value transformed into string or array of strings (or null when not possible)`, () => {
    expect(toQueryStateValue(value)).toEqual(stateValue)
  })
})
