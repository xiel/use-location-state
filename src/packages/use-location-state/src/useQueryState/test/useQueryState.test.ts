import { act, renderHook } from '@testing-library/react-hooks'
import { useQueryState } from '../useQueryState'
import useTestQueryStringInterface from './useTestQueryStringInterface'
import {
  asyncAct,
  unwrapABResult,
  unwrapResult,
} from 'use-location-state-test-helpers/test-helpers'

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
      const testQSI = renderHook(() => useTestQueryStringInterface()).result
        .current

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

  it('should reset query string when null is passed as value', () => {
    const testQSI = renderHook(() => useTestQueryStringInterface()).result
      .current

    // put the clashing hooks into the same render test hook (so they always update together)
    const { result, unmount } = renderHook(() =>
      useQueryState('name', 'Sarah', {
        queryStringInterface: testQSI,
      })
    )

    const r = unwrapResult(result)

    // expect to get the default values
    expect(testQSI.getQueryString()).toBe('')
    expect(r.value).toBe('Sarah')

    // set a value different than the default
    act(() => void r.setValue('Kim'))
    expect(r.value).toBe('Kim')
    expect(testQSI.getQueryString()).toBe('name=Kim')

    // when setting the value to null, we expect to get the default value again, and the query string should be reset
    act(() => void r.setValue(null))
    expect(r.value).toBe('Sarah')
    expect(testQSI.getQueryString()).toBe('')

    unmount()
  })

  it('should update value if defaultValue changes', () => {
    const testQSI = renderHook(() => useTestQueryStringInterface()).result
      .current

    // put the clashing hooks into the same render test hook (so they always update together)
    const { result, rerender, unmount } = renderHook(
      (defaultValue) =>
        useQueryState('name', defaultValue, {
          queryStringInterface: testQSI,
        }),
      { initialProps: 'Foo' }
    )

    const r = unwrapResult(result)

    // expect to get the default values
    expect(testQSI.getQueryString()).toBe('')
    expect(r.value).toBe('Foo')

    // update the default value
    rerender('Bar')
    // act(() => void r.setValue('Kim'))

    expect(testQSI.getQueryString()).toBe('')
    expect(r.value).toBe('Bar')

    unmount()
  })
})
