import { act, renderHook } from '@testing-library/react-hooks'
import { useLocationState } from '../../use-location-state'
import { unwrapABResult } from '../../../../../test-helpers/test-helpers'
import { createMemoryHistory } from 'history'

const history: () => typeof window.history = () => {
  const h = createMemoryHistory()
  return {
    state: h.location.state,
    pushState: (data, title, href) => h.push(href || '', data),
    replaceState: (data, title, href) => h.replace(href || '', data),
    back: h.goBack,
    forward: h.goForward,
    length: h.entries.length,
    scrollRestoration: 'auto',
    go: h.go,
  }
}

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
`('defaultValue: $defaultValue, newValue: $newValue', ({ defaultValue = '', newValue }) => {
  test(`should return default value and set newValue successfully`, () => {
    act(() => window.history.replaceState({}, '', ''))
    const { result, unmount } = renderHook(() => {
      const a = useLocationState('item', defaultValue)
      const b = useLocationState('item', defaultValue)
      return { a, b }
    })

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
    expect(window.history.state).toEqual({ __useLocationState: {} })

    act(() => void unmount())
  })
})
