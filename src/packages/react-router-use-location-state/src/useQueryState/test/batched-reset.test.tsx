import { act, renderHook } from '@testing-library/react-hooks'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as wrapper } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useQueryState } from '../useQueryState'
import { unwrapABResult } from 'use-location-state-test-helpers/test-helpers'
import { useEffect } from 'react'

beforeEach(resetReactRouter)

describe('Resetting to original value in batch with a following no-op', () => {
  test('using clicks', () => {
    const onRender = jest.fn()

    function Comp() {
      const [name, setName] = useQueryState('name', '')
      const [age, setAge] = useQueryState('age', 18)
      const state = { age, name }
      onRender(state)
      return (
        <>
          <button
            onClick={() => {
              setName('Ron')
              setAge(18)
            }}
          >
            set
          </button>
          <button
            onClick={() => {
              setName('')
              setAge(18)
            }}
          >
            reset
          </button>
        </>
      )
    }

    render(<Comp />, { wrapper })

    expect(window.location.search).toEqual('')
    screen.getByRole('button', { name: 'set' }).click()

    expect(onRender).toHaveBeenCalledTimes(2)
    expect(onRender).toHaveBeenLastCalledWith({
      age: 18,
      name: 'Ron',
    })
    expect(window.location.search).toEqual('?name=Ron')

    screen.getByRole('button', { name: 'reset' }).click()
    expect(window.location.search).toEqual('')
  })

  test(`using setter from hook directly`, () => {
    const { result, unmount } = renderHook(
      () => ({
        a: useQueryState('age', 18),
        b: useQueryState('names', [] as string[]),
      }),
      { wrapper }
    )

    const { a: age, b: names } = unwrapABResult(result)

    // default
    expect(result.error).toBe(undefined)
    expect(window.location.search).toEqual('')
    expect(age.value).toEqual(18)
    expect(names.value).toEqual([])

    // set next values:
    act(() => {
      age.setValue(31)
      names.setValue([])
    })

    // check new value
    expect(result.error).toBe(undefined)
    expect(window.location.search).toEqual('?age=31')
    expect(age.value).toEqual(31)
    expect(names.value).toEqual([])

    // reset to original values
    act(() => {
      age.setValue(18)
      names.setValue([])
    })

    // check successful reset
    expect(result.error).toBe(undefined)
    expect(window.location.search).toEqual('')
    expect(age.value).toEqual(18)
    expect(names.value).toEqual([])

    unmount()
  })
})

function resetReactRouter() {
  renderHook(
    () => {
      const navigate = useNavigate()

      useEffect(
        () =>
          navigate({
            pathname: '',
            search: '',
          }),
        [navigate]
      )
    },
    { wrapper }
  )
}
