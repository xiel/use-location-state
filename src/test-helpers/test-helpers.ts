import { act } from 'react-test-renderer'

export async function asyncAct(callback: () => any) {
  return await act(async () => {
    await callback()
  })
}

// nicer access to the current value and setter function from the result ref
export function unwrapResult<A, B>(result: { current: [A, B] }) {
  return {
    get value() {
      return result.current[0]
    },
    setValue: result.current[1],
  }
}

// nicer access to the current value and setter function from the result ref
export function unwrapABResult<A, ASet, B, BSet>(result: {
  current: { a: [A, ASet]; b: [B, BSet] }
}) {
  return {
    a: {
      get value() {
        return result.current['a'][0]
      },
      setValue: result.current['a'][1],
    },
    b: {
      get value() {
        return result.current['b'][0]
      },
      setValue: result.current['b'][1],
    },
  }
}
