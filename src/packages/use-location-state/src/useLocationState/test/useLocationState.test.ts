import { act, renderHook } from '@testing-library/react-hooks'
import { useLocationState } from '../../use-location-state'
import { asyncAct, unwrapABResult } from '../../helpers/test-helpers'

describe('useLocationState', () => {
  it('should keep to useLocationState hooks with the same name in sync', async () => {
    act(() => window.history.replaceState({}, '', ''))
    const { result, unmount } = renderHook(() => {
      const a = useLocationState('item', 'Sarah')
      const b = useLocationState('item', '')
      return { a, b }
    })

    const { a, b } = unwrapABResult(result)

    expect(a.value).toEqual('Sarah')
    expect(b.value).toEqual('')

    await asyncAct(async () => void a.setValue('Kim'))

    expect(a.value).toEqual('Kim')
    expect(b.value).toEqual('Kim')

    act(() => void unmount())
  })

  it('should call set function with current value', async () => {
    act(() => window.history.replaceState({}, '', ''))
    const { result, unmount } = renderHook(() => {
      const a = useLocationState('item', 'Kim')
      const b = useLocationState('item', '')
      return { a, b }
    })

    const { a, b } = unwrapABResult(result)

    expect(a.value).toEqual('Kim')
    expect(b.value).toEqual('')

    await asyncAct(async () => a.setValue(currentValue => currentValue + 'berly'))

    expect(a.value).toEqual('Kimberly')
    expect(b.value).toEqual('Kimberly')

    act(() => void unmount())
  })

  it('should call set function with current value - array', async () => {
    act(() => window.history.replaceState({}, '', ''))
    const { result, unmount } = renderHook(() => {
      const a = useLocationState('arr', [1, 2, 3])
      const b = useLocationState('arr', [])
      return { a, b }
    })

    const { a, b } = unwrapABResult(result)

    expect(a.value).toEqual([1, 2, 3])
    expect(b.value).toEqual([])

    await asyncAct(async () => a.setValue(arr => arr.concat(4, 5, 6)))

    expect(a.value).toEqual([1, 2, 3, 4, 5, 6])
    expect(b.value).toEqual([1, 2, 3, 4, 5, 6])

    act(() => void unmount())
  })
})
