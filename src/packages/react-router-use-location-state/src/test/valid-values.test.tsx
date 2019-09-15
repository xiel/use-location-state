import { EMPTY_ARRAY_STRING } from 'query-state-core'
import { act, renderHook } from '@testing-library/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import { SetQueryStateItemFn } from 'use-location-state/dist/hooks/types'
import { useQueryState } from '../react-router-use-location-state'

// nicer access to the current value and setter function from the result ref
export function unwrapResult<A>(result: { current: [A, SetQueryStateItemFn<A>] }) {
  return {
    get value() {
      return result.current[0]
    },
    setValue: result.current[1],
  }
}

describe.each`
  defaultValue               | newValue               | newValueQueryString
  ${'not empty'}             | ${''}                  | ${'?item='}
  ${'not empty'}             | ${'still not empty'}   | ${'?item=still+not+empty'}
  ${''}                      | ${'not empty anymore'} | ${'?item=not+empty+anymore'}
  ${[]}                      | ${['new', 'entries']}  | ${'?item=new&item=entries'}
  ${['']}                    | ${['new', 'entries']}  | ${'?item=new&item=entries'}
  ${['multiple', 'strings']} | ${[]}                  | ${'?item=' + encodeURIComponent(EMPTY_ARRAY_STRING)}
  ${['multiple', 'strings']} | ${['']}                | ${'?item='}
  ${['multiple', 'strings']} | ${['just one entry']}  | ${'?item=just+one+entry'}
  ${0}                       | ${-50}                 | ${'?item=-50'}
  ${99}                      | ${3.14}                | ${'?item=3.14'}
  ${Infinity}                | ${-Infinity}           | ${'?item=-Infinity'}
  ${1e23}                    | ${1e24}                | ${'?item=' + encodeURIComponent((1e24).toString())}
  ${true}                    | ${false}               | ${'?item=false'}
  ${true}                    | ${true}                | ${''}
  ${false}                   | ${true}                | ${'?item=true'}
  ${false}                   | ${false}               | ${''}
`(
  'defaultValue $defaultValue, newValue $newValue',
  ({ defaultValue = '', newValue, newValueQueryString }) => {
    beforeEach(() => {
      window.history.replaceState(null, '', '')
    })

    test(`should return default value and set newValue successfully`, () => {
      const { result, unmount } = renderHook(() => useQueryState('item', defaultValue), {
        wrapper: Router,
      })
      const r = unwrapResult(result)
      // default
      expect(result.error).toBe(undefined)
      expect(window.location.search).toEqual('')
      expect(r.value).toEqual(defaultValue)
      // new value
      act(() => r.setValue(newValue))
      expect(window.location.search).toEqual(newValueQueryString)
      expect(r.value).toEqual(newValue)
      // back to default
      act(() => r.setValue(defaultValue))
      expect(r.value).toEqual(defaultValue)
      expect(window.location.search).toEqual('')

      unmount()
    })
  }
)

it('should warn when used outside of router', () => {
  const orgWarn = console.warn
  console.warn = jest.fn()
  const { unmount } = renderHook(() => useQueryState('item', ''))
  expect(console.warn).toHaveBeenCalledTimes(1)
  unmount()
  console.warn = orgWarn
})
