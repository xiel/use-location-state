import { renderHook, act } from 'react-hooks-testing-library'
import { useLocationQueryState } from '../use-location-state'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import { SetQueryStateItemFn } from '../types'

// nicer access to the current value and setter function from the result ref
function unwrapResult<A, B>(result: {
  current: { a: [A, SetQueryStateItemFn<A>]; b: [B, SetQueryStateItemFn<B>] }
}) {
  return {
    get valueA() {
      return result.current['a'][0]
    },
    get valueB() {
      return result.current['b'][0]
    },
    setValueA: result.current['a'][1],
    setValueB: result.current['b'][1],
  }
}

describe('enforce types', () => {
  test('usage of two queryState hooks with different types on the same item name', () => {
    const testQSI = renderHook(() => useTestQueryStringInterface()).result.current

    // put the clashing hooks into the same render test hook (so they always update together)
    const { result, unmount } = renderHook(() => {
      const a = useLocationQueryState('clashingItem', 'XL', {
        queryStringInterface: testQSI,
      })
      const b = useLocationQueryState('clashingItem', 123, {
        queryStringInterface: testQSI,
      })
      return { a, b }
    })

    // get/set interfaces for the results (ref)
    const r = unwrapResult(result)

    // expect to get the default values
    expect(testQSI.getQueryString()).toBe('')
    expect(r.valueA).toBe('XL')
    expect(r.valueB).toBe(123)

    // types should be enforced if possible ...
    act(() => r.setValueA('111'))
    expect(testQSI.getQueryString()).toBe('clashingItem=111')
    expect(r.valueA).toBe('111')
    expect(r.valueB).toBe(111)

    // ...otherwise default values should be returned again
    act(() => r.setValueA('Not a Number'))
    expect(testQSI.getQueryString()).toBe('clashingItem=Not+a+Number')
    expect(r.valueA).toBe('Not a Number')
    expect(r.valueB).toBe(123)
    act(() => unmount())
  })
})

// test.todo('number')
// test.todo('array of strings')
// test.todo('invalid values like object, symbol should throw')
// test.todo('every supported combination')
