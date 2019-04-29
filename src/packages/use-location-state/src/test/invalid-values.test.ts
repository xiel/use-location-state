import { renderHook, act } from 'react-hooks-testing-library'
import { useLocationQueryState } from '../use-location-state'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import { unwrapResult } from './test-helpers'

describe('invalid input defaultValue', () => {
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

describe('invalid value in setter', () => {
  describe.each`
    invalidValueToSet
    ${NaN}
    ${() => void 0}
    ${undefined}
    ${new Date()}
    ${{ object: 1 }}
    ${Symbol('Test')}
  `('invalidValueToSet $invalidValueToSet', ({ invalidValueToSet }) => {
    test(`should throw`, () => {
      const orgWarn = console.warn
      console.warn = jest.fn()
      const testQSI = renderHook(() => useTestQueryStringInterface()).result.current
      const { result, unmount } = renderHook(() =>
        useLocationQueryState('itemName', 'valid default value', {
          queryStringInterface: testQSI,
        })
      )
      const r = unwrapResult(result)

      expect(result.error).toBe(undefined)
      expect(r.value).toBe('valid default value')
      expect(testQSI.getQueryString()).toBe('')
      act(() => r.setValue('new value'))
      expect(r.value).toBe('new value')
      expect(testQSI.getQueryString()).toBe('itemName=new+value')

      // calling setter with an invalid value will reset the state to the default value
      act(() => r.setValue(invalidValueToSet))
      expect(r.value).toBe('valid default value')
      expect(testQSI.getQueryString()).toBe('')
      expect(console.warn).toHaveBeenCalledTimes(1)

      act(() => unmount())
      console.warn = orgWarn
    })
  })

})




