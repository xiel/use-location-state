import { act, renderHook } from '@testing-library/react-hooks'
import { unwrapABResult } from 'use-location-state-test-helpers/test-helpers'
import { useLocationState } from '../useLocationState'
import { BrowserRouter as Router } from 'react-router-dom'

describe.each`
  defaultValue               | newValue
  ${'not empty'}             | ${''}
  ${'not empty'}             | ${'still not empty'}
  ${''}                      | ${'not empty anymore'}
  ${[]}                      | ${['new', 'entries']}
  ${['']}                    | ${['new', 'entries']}
  ${['same', 'entries']}     | ${['same', 'entries']}
  ${[]}                      | ${[]}
  ${['multiple', 'strings']} | ${[]}
  ${['multiple', 'strings']} | ${['']}
  ${['multiple', 'strings']} | ${['just one entry']}
  ${new Date()}              | ${new Date(0)}
  ${0}                       | ${-50}
  ${99}                      | ${3.14}
  ${Infinity}                | ${-Infinity}
  ${1e23}                    | ${1e24}
  ${true}                    | ${false}
  ${true}                    | ${true}
  ${false}                   | ${true}
  ${false}                   | ${false}
  ${null}                    | ${true}
  ${undefined}               | ${true}
  ${{ testObj: 1 }}          | ${{ testObj: 5 }}
  ${[1, 2, 3]}               | ${[4, 5, 6]}
`(
  'defaultValue: $defaultValue, newValue: $newValue',
  ({ defaultValue = '', newValue }) => {
    test(`should return default value and set newValue successfully`, async () => {
      act(() => window.history.replaceState({}, '', ''))
      const warn = jest.spyOn(console, 'warn')
      const error = jest.spyOn(console, 'error')

      const { result, unmount } = renderHook(
        () => {
          const a = useLocationState('item', defaultValue)
          const b = useLocationState('item', defaultValue)
          return { a, b }
        },
        { wrapper: Router }
      )

      const { a, b } = unwrapABResult(result)

      // default
      expect(result.error).toBe(undefined)
      expect(window.history.state).toEqual({})
      expect(a.value).toEqual(defaultValue)
      expect(b.value).toEqual(defaultValue)

      // new value
      act(() => a.setValue(newValue))
      expect(a.value).toEqual(newValue)
      expect(b.value).toEqual(newValue)

      // // back to default
      act(() => a.setValue(defaultValue))
      expect(a.value).toEqual(defaultValue)
      expect(b.value).toEqual(defaultValue)

      expect(warn).toHaveBeenCalledTimes(0)
      expect(error).toHaveBeenCalledTimes(0)

      warn.mockRestore()
      error.mockRestore()
      await act(async () => void unmount())
    })
  }
)
