import { renderHook, act } from 'react-hooks-testing-library'
import { useLocationQueryState } from '../use-location-state'
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

// test.todo('array of strings')
// test.todo('every supported combination')

describe('valid defaultValues', () => {
  describe.each`
    defaultValue
    ${NaN}
    ${() => void 0}
    ${undefined}
    ${null}
    ${new Date()}
    ${{ object: 1 }}
    ${Symbol('Test')}
  `('defaultValue $defaultValue', ({ defaultValue }) => {

    test(`should throw`, () => {
      const orgError = console.error
      console.error = jest.fn()
      const testQSI = renderHook(() => useTestQueryStringInterface()).result.current
      const { result, unmount } = renderHook(() =>
        useLocationQueryState('anything', defaultValue, {
          queryStringInterface: testQSI,
        })
      )
      expect(result.error).toMatchInlineSnapshot(`[Error: unsupported defaultValue]`)
      expect(testQSI.getQueryString()).toBe('')
      act(() => unmount())
      console.error = orgError
    })
  })
})
