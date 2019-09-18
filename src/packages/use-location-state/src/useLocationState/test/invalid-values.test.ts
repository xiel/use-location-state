import { act, renderHook } from '@testing-library/react-hooks'
import { useLocationState } from '../../use-location-state'
import { unwrapABResult } from '../../helpers/test-helpers'

const { spyOn } = jest

describe('invalid input defaultValue', () => {
  describe.each`
    defaultValue
    ${Symbol('Test')}
    ${() => () => 'function returning a function'}
  `('defaultValue $defaultValue', ({ defaultValue }) => {
    test(`should throw`, () => {
      // reset state
      act(() => window.history.replaceState({}, '', ''))

      const replaceState = spyOn(window.history, 'replaceState')
      const { result, unmount } = renderHook(() => useLocationState('anything', defaultValue))

      expect(result.error).toMatchInlineSnapshot(`[Error: unsupported defaultValue]`)
      expect(replaceState).toHaveBeenCalledTimes(0)

      // restore mock
      replaceState.mockRestore()
      act(() => void unmount())
    })
  })
})

describe('invalid value in setter', () => {
  describe.each`
    invalidValueToSet
    ${Symbol('Test')}
    ${() => () => 'function returning a function'}
    ${() => Symbol('InFunc')}
  `('invalidValueToSet $invalidValueToSet', ({ invalidValueToSet }) => {
    test(`should throw`, async () => {
      // reset state and spy
      act(() => window.history.replaceState({}, '', ''))
      const warn = spyOn(console, 'warn').mockImplementation()

      const { result, unmount } = renderHook(() => {
        const a = useLocationState('itemName', 'valid default value')
        const b = useLocationState('itemName', '')
        return { a, b }
      })

      const { a, b } = unwrapABResult(result)

      expect(result.error).toBe(undefined)
      expect(a.value).toBe('valid default value')

      await act(async () => a.setValue('new value'))
      expect(a.value).toBe('new value')
      expect(b.value).toBe('new value')

      // calling setter with an invalid value will reset the state to the default value
      await act(async () => a.setValue(invalidValueToSet))
      expect(a.value).toBe('valid default value')
      expect(b.value).toBe('')

      expect(warn).toHaveBeenCalledTimes(1)
      warn.mockRestore()
      await act(async () => void unmount())
    })
  })
})
