import { act } from 'react-test-renderer'
import { SetQueryStateItemFn } from '../useQueryState/useQueryState.types'

export async function asyncAct(callback: () => any) {
  return await act(async () => {
    await callback()
  })
}

// nicer access to the current value and setter function from the result ref
export function unwrapResult<A>(result: { current: [A, SetQueryStateItemFn<A>] }) {
  return {
    get value() {
      return result.current[0]
    },
    setValue: result.current[1],
  }
}

// nicer access to the current value and setter function from the result ref
export function unwrapABResult<A, B>(result: {
  current: { a: [A, SetQueryStateItemFn<A>]; b: [B, SetQueryStateItemFn<B>] }
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
