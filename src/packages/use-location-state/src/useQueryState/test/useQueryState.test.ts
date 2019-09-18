import { act, renderHook } from '@testing-library/react-hooks'
import { useQueryState } from '../../use-location-state'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import { asyncAct, unwrapABResult, unwrapResult } from '../../../../../test-helpers/test-helpers'

describe('useQueryState', () => {
  it('should automatically use hashQSI when no queryStringInterface is defined', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const r = unwrapResult(result)
    expect(r.value).toEqual('Sarah')
    await asyncAct(async () => void r.setValue('Kim'))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(r.value).toEqual('Kim')
    unmount()
  })

  describe('should enforce types', () => {
    test('usage of two queryState hooks with different types on the same item name', () => {
      const testQSI = renderHook(() => useTestQueryStringInterface()).result.current

      // put the clashing hooks into the same render test hook (so they always update together)
      const { result, unmount } = renderHook(() => {
        const a = useQueryState('clashingItem', 'XL', {
          queryStringInterface: testQSI,
        })
        const b = useQueryState('clashingItem', 123, {
          queryStringInterface: testQSI,
        })
        return { a, b }
      })

      // get/set interfaces for the results (ref)
      const { a, b } = unwrapABResult(result)

      // expect to get the default values
      expect(testQSI.getQueryString()).toBe('')
      expect(a.value).toBe('XL')
      expect(b.value).toBe(123)

      // types should be enforced if possible ...
      act(() => a.setValue('111'))
      expect(testQSI.getQueryString()).toBe('clashingItem=111')
      expect(a.value).toBe('111')
      expect(b.value).toBe(111)

      // ...otherwise default values should be returned again
      act(() => a.setValue('Not a Number'))
      expect(testQSI.getQueryString()).toBe('clashingItem=Not+a+Number')
      expect(a.value).toBe('Not a Number')
      expect(b.value).toBe(123)
      unmount()
    })
  })
})



