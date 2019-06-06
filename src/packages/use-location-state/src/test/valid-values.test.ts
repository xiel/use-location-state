import { EMPTY_ARRAY_STRING } from 'query-state-core'
import { act, renderHook } from 'react-hooks-testing-library'
import { useQueryState } from '../use-location-state'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import { unwrapResult } from './test-helpers'

const enc = encodeURIComponent

describe.each`
  defaultValue               | newValue               | newValueQueryString
  ${'not empty'}             | ${''}                  | ${'item='}
  ${'not empty'}             | ${'still not empty'}   | ${'item=still+not+empty'}
  ${''}                      | ${'not empty anymore'} | ${'item=not+empty+anymore'}
  ${[]}                      | ${['new', 'entries']}  | ${'item=new&item=entries'}
  ${['']}                    | ${['new', 'entries']}  | ${'item=new&item=entries'}
  ${['multiple', 'strings']} | ${[]}                  | ${'item=' + enc(EMPTY_ARRAY_STRING)}
  ${['multiple', 'strings']} | ${['']}                | ${'item='}
  ${['multiple', 'strings']} | ${['just one entry']}  | ${'item=just+one+entry'}
  ${new Date()}              | ${new Date(0)}         | ${'item=' + enc('1970-01-01T00:00:00.000Z')}
  ${0}                       | ${-50}                 | ${'item=-50'}
  ${99}                      | ${3.14}                | ${'item=3.14'}
  ${Infinity}                | ${-Infinity}           | ${'item=-Infinity'}
  ${1e23}                    | ${1e24}                | ${'item=' + enc((1e24).toString())}
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
        useQueryState('item', defaultValue, {
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
