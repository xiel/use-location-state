import { cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useHashQueryState } from '../../use-location-state'
import { asyncAct, unwrapABResult } from '../../helpers/test-helpers'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

beforeEach(() => {
  window.location.hash = ''
  cleanup()
})

afterAll(() => {
  window.location.hash = ''
})

describe('useHashQueryState', () => {
  it('should work with internal HashQueryStringInterface', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const val = () => result.current[0]
    const setVal: typeof result.current[1] = newValue => result.current[1](newValue)

    expect(val()).toEqual('Sarah')

    await asyncAct(async () => setVal('Kim'))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(val()).toEqual('Kim')
    unmount()
  })

  it('should reset hash when default', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const val = () => result.current[0]
    const setVal: typeof result.current[1] = newValue => result.current[1](newValue)

    expect(val()).toEqual('Sarah')
    await asyncAct(async () => void setVal('Kim'))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(val()).toEqual('Kim')

    await asyncAct(() => void setVal('Sarah'))

    expect(window.location.hash).toEqual('')
    expect(val()).toEqual('Sarah')
    unmount()
  })

  it('should enforce types with same item name', async () => {
    // two hooks use the same itemName -> they should still get the value in their correct type if possible (otherwise their own defaultValue)
    const { result, unmount } = renderHook(
      ({ itemName, defaultValueNum, defaultValueStr }) => {
        // a = num
        const a = useHashQueryState(itemName, defaultValueNum)
        // b = str
        const b = useHashQueryState(itemName, defaultValueStr)
        return { a, b }
      },
      {
        initialProps: { itemName: 'name', defaultValueNum: 25, defaultValueStr: 'Sarah' },
      }
    )

    const { a: num, b: str } = unwrapABResult(result)

    // initially both should show their defaults
    expect(window.location.hash).toEqual('')
    expect(str.value).toEqual('Sarah')
    expect(num.value).toEqual(25)

    // after setting a string value for same item,
    // numerical QS should still return default number, because string "Kim" cannot be transformed into a number
    await asyncAct(async () => str.setValue('Kim'))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(str.value).toEqual('Kim')
    expect(num.value).toEqual(25)

    await asyncAct(async () => str.setValue('Tom'))

    expect(window.location.hash).toEqual('#name=Tom')
    expect(str.value).toEqual('Tom')
    expect(num.value).toEqual(25)

    // string QS should return number as string, after setting it via numerical setter
    await asyncAct(async () => num.setValue(375))
    expect(window.location.hash).toEqual('#name=375')
    expect(num.value).toEqual(375)
    expect(str.value).toEqual('375')

    unmount()
  })
})
