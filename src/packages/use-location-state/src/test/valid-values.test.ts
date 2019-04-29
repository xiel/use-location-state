import { renderHook, act } from 'react-hooks-testing-library'
import { useLocationQueryState } from '../use-location-state'
import { EMPTY_ARRAY_STRING_URI_ENCODED } from 'query-state-core'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import { SetQueryStateItemFn } from '../types'

// nicer access to the current value and setter function from the result ref
function unwrapResult<A>(result: { current: [A, SetQueryStateItemFn<A>] }) {
  return {
    get value() {
      return result.current[0]
    },
    setValue: result.current[1],
  }
}

describe.each`
  defaultValue               | newValue               | newValueQueryString
  ${'not empty'}             | ${''}                  | ${'item='}
  ${'not empty'}             | ${'still not empty'}   | ${'item=still+not+empty'}
  ${''}                      | ${'not empty anymore'} | ${'item=not+empty+anymore'}
  ${[]}                      | ${['new', 'entries']}  | ${'item=new&item=entries'}
  ${['']}                    | ${['new', 'entries']}  | ${'item=new&item=entries'}
  ${['multiple', 'strings']} | ${[]}                  | ${'item=' + EMPTY_ARRAY_STRING_URI_ENCODED}
  ${['multiple', 'strings']} | ${['']}                | ${'item='}
  ${['multiple', 'strings']} | ${['just one entry']}  | ${'item=just+one+entry'}
  ${0}                       | ${-50}                 | ${'item=-50'}
  ${99}                      | ${3.14}                | ${'item=3.14'}
  ${Infinity}                | ${-Infinity}           | ${'item=-Infinity'}
  ${1e23}                    | ${1e24}                | ${'item=' + encodeURIComponent((1e24).toString())}
  ${true}                    | ${false}               | ${'item=false'}
  ${true}                    | ${true}                | ${''}
  ${false}                   | ${true}                | ${'item=true'}
  ${false}                   | ${false}               | ${''}
`(
  'defaultValue $defaultValue, newValue $newValue',
  ({ defaultValue = '', newValue, newValueQueryString }) => {
    test(`should return default value and set newValue successfully`, () => {
      const testQSI = renderHook(() => useTestQueryStringInterface()).result.current
      const { result, unmount } = renderHook(() =>
        useLocationQueryState('item', defaultValue, {
          queryStringInterface: testQSI,
        })
      )
      const r = unwrapResult(result)
      // default
      expect(result.error).toBe(undefined)
      expect(testQSI.getQueryString()).toEqual('')
      expect(r.value).toEqual(defaultValue)
      // new value
      act(() => r.setValue(newValue))
      expect(testQSI.getQueryString()).toEqual(newValueQueryString)
      expect(r.value).toEqual(newValue)
      // back to default
      act(() => r.setValue(defaultValue))
      expect(r.value).toEqual(defaultValue)
      expect(testQSI.getQueryString()).toEqual('')

      void act(() => unmount())
    })
  }
)