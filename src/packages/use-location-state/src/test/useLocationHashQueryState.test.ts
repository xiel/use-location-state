import { act } from 'react-dom/test-utils'
import { cleanup, wait } from 'react-testing-library'
import { renderHook } from 'react-hooks-testing-library'
import { useLocationHashQueryState } from '../use-location-state'

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

async function asyncAct(callback: () => any) {
  // @ts-ignore
  return act(async () => {
    await callback()
  })
}

describe('useLocationHashQueryState', () => {
  it('should work with internal HashQueryStringInterface', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
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
    unmount()
  })

  it('should reset hash when default', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
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
    const { result: resultStr, unmount: unmountStr } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const { result: resultNum, unmount: unmountNum } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 25 },
      }
    )

    const valStr = () => resultStr.current[0]
    const setValStr: typeof resultStr.current[1] = newValue => resultStr.current[1](newValue)

    const valNum = () => resultNum.current[0]
    const setValNum: typeof resultNum.current[1] = newValue => resultNum.current[1](newValue)

    // initially both should show their defaults
    expect(window.location.hash).toEqual('')
    expect(valStr()).toEqual('Sarah')
    expect(valNum()).toEqual(25)

    // numerical QS should still return default number, after setting a string value for same item,
    // bacause this string "Kim" can not be transformed into a number
    await asyncAct(async () => setValStr('Kim'))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(valStr()).toEqual('Kim')
    expect(valNum()).toEqual(25)

    // string QS should return number as string, after setting it via numerical setter
    await asyncAct(async () => setValNum(375))
    expect(window.location.hash).toEqual('#name=375')

    // sometimes test fails without this wait, probably because the hooks are rendered separately,
    // an the string one did not update yet
    await wait()
    expect(valStr()).toEqual('375')
    expect(valNum()).toEqual(375)

    unmountStr()
    unmountNum()
  })
})

// describe('string & boolean', () => {
//   // two hooks use the same itemName -> they should still get the value in their correct type if possible (otherwise their own defaultValue)
//   const { result: resultStr, waitForNextUpdate: waitForNextUpdateStr } = renderHook(
//     ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
//     {
//       initialProps: { itemName: 'name', defaultValue: 'Sarah' },
//     }
//   )
//   const { result: resultBool, waitForNextUpdate: waitForNextUpdateBool } = renderHook(
//     ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
//     {
//       initialProps: { itemName: 'name', defaultValue: false },
//     }
//   )
//
//   const valStr = () => resultStr.current[0]
//   const setValStr: typeof resultStr.current[1] = newValue => resultStr.current[1](newValue)
//
//   const valBool = () => resultBool.current[0]
//   const setValBool: typeof resultBool.current[1] = newValue => resultBool.current[1](newValue)
//
//
//   test('initial defaults', async () => {
//     // initially both should show their defaults
//     expect(window.location.hash).toEqual('')
//     expect(valStr()).toEqual('Sarah')
//     expect(valBool()).toEqual(false)
//   })
//
//   test('bool QS should return default number, after setting a string value for same item', async () => {
//     // initially both should show their defaults
//     act(() => setValStr('Kim'))
//     await waitForNextUpdateBool()
//     expect(window.location.hash).toEqual('#name=Kim')
//     expect(valStr()).toEqual('Kim')
//     expect(valBool()).toEqual(false)
//   })
//
//   test('string QS should return bool as string, after setting it via bool setter', async () => {
//     // initially both should show their defaults
//     act(() => setValBool(true))
//     await waitForNextUpdateStr()
//     expect(window.location.hash).toEqual('#name=true')
//     expect(valStr()).toEqual('true')
//     expect(valBool()).toEqual(true)
//
//     act(() => setValBool(false))
//     await waitForNextUpdateStr()
//     expect(window.location.hash).toEqual('')
//     expect(valStr()).toEqual('Sarah') // back to default
//     expect(valBool()).toEqual(false)
//   })
// })
