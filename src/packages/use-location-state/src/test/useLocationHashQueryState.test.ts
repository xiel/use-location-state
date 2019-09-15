import { act } from 'react-dom/test-utils'
import { cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useHashQueryState } from '../use-location-state'
import { asyncAct } from './test-helpers'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

beforeEach(() => {
  act(() => {
    window.location.hash = ''
  })
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
        const num = useHashQueryState(itemName, defaultValueNum)
        const str = useHashQueryState(itemName, defaultValueStr)
        return { num, str }
      },
      {
        initialProps: { itemName: 'name', defaultValueNum: 25, defaultValueStr: 'Sarah' },
      }
    )

    const valStr = () => result.current.str[0]
    const setValStr: typeof result.current.str[1] = newValue => result.current.str[1](newValue)

    const valNum = () => result.current.num[0]
    const setValNum: typeof result.current.num[1] = newValue => result.current.num[1](newValue)

    // initially both should show their defaults
    expect(window.location.hash).toEqual('')
    expect(valStr()).toEqual('Sarah')
    expect(valNum()).toEqual(25)

    // after setting a string value for same item,
    // numerical QS should still return default number, because string "Kim" cannot be transformed into a number
    await asyncAct(async () => setValStr('Kim'))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(valStr()).toEqual('Kim')
    expect(valNum()).toEqual(25)

    await asyncAct(async () => setValStr('Tom'))

    expect(window.location.hash).toEqual('#name=Tom')
    expect(valStr()).toEqual('Tom')
    expect(valNum()).toEqual(25)

    // string QS should return number as string, after setting it via numerical setter
    await asyncAct(async () => setValNum(375))
    expect(window.location.hash).toEqual('#name=375')
    expect(valNum()).toEqual(375)
    expect(valStr()).toEqual('375')

    unmount()
  })
})
