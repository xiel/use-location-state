import { EMPTY_ARRAY_STRING } from 'query-state-core'
import { act, renderHook } from '@testing-library/react-hooks'
import { getServerSideProps, useQueryReducer, useQueryState } from '../next'
import * as NextExportsInRoot from '../../next'
import {
  unwrapABResult,
  unwrapResult,
} from 'use-location-state-test-helpers/test-helpers'
import mockRouter from 'next-router-mock'
import { useRouter } from 'next/router'

import {
  render,
  screen,
  waitFor,
  act as actReact,
} from '@testing-library/react'

jest.mock('next/router', () => require('next-router-mock'))

beforeEach(() => {
  mockRouter.setCurrentUrl('')
})

describe.each`
  defaultValue               | newValue               | newValueQueryString
  ${'not empty'}             | ${''}                  | ${'?item='}
  ${'not empty'}             | ${'still not empty'}   | ${'?item=' + encodeURIComponent('still not empty')}
  ${''}                      | ${'not empty anymore'} | ${'?item=' + encodeURIComponent('not empty anymore')}
  ${[]}                      | ${['new', 'entries']}  | ${'?item=new&item=entries'}
  ${['']}                    | ${['new', 'entries']}  | ${'?item=new&item=entries'}
  ${['multiple', 'strings']} | ${[]}                  | ${'?item=' + encodeURIComponent(EMPTY_ARRAY_STRING)}
  ${['multiple', 'strings']} | ${['']}                | ${'?item='}
  ${['multiple', 'strings']} | ${['just one entry']}  | ${'?item=' + encodeURIComponent('just one entry')}
  ${0}                       | ${-50}                 | ${'?item=-50'}
  ${99}                      | ${3.14}                | ${'?item=3.14'}
  ${Infinity}                | ${-Infinity}           | ${'?item=-Infinity'}
  ${1e23}                    | ${1e24}                | ${'?item=' + encodeURIComponent((1e24).toString())}
  ${true}                    | ${false}               | ${'?item=false'}
  ${true}                    | ${true}                | ${''}
  ${false}                   | ${true}                | ${'?item=true'}
  ${false}                   | ${false}               | ${''}
`(
  'defaultValue $defaultValue, newValue $newValue',
  ({ defaultValue = '', newValue, newValueQueryString }) => {
    let routerAsPath = ''
    let reducerState = ''

    test(`should return default value and set newValue successfully`, async () => {
      const { result, unmount } = renderHook(() => {
        routerAsPath = useRouter().asPath

        reducerState = useQueryReducer(
          'item',
          (_, action) => action,
          defaultValue
        )[0]

        return useQueryState('item', defaultValue)
      })

      const r = unwrapResult(result)
      // default
      expect(result.error).toBe(undefined)
      expect(routerAsPath).toEqual('')
      expect(r.value).toEqual(defaultValue)
      // new value
      await act(async () => r.setValue(newValue))
      expect(routerAsPath).toEqual(newValueQueryString)
      expect(r.value).toEqual(newValue)
      expect(reducerState).toEqual(newValue)

      // back to default
      await act(async () => r.setValue(defaultValue))
      expect(r.value).toEqual(defaultValue)
      expect(routerAsPath).toEqual('')

      unmount()
    })
  }
)

test('getServerSideProps', async () => {
  expect(await getServerSideProps({} as any)).toEqual({
    props: {},
  })
})

test('Exports for next in root folder', () => {
  expect(Object.keys(NextExportsInRoot)).toEqual([
    'getServerSideProps',
    'useLocationState',
    'useQueryReducer',
    'useQueryState',
  ])
})

describe('Resetting to original value in batch with a following no-op', () => {
  test('using clicks', async () => {
    const onRender = jest.fn()
    let routerAsPath = ''

    function Comp() {
      const [name, setName] = useQueryState('name', '')
      const [age, setAge] = useQueryState('age', 18)
      const state = { age, name }
      onRender(state)
      routerAsPath = useRouter().asPath
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

    render(<Comp />)

    expect(routerAsPath).toEqual('')

    await actReact(async () => {
      screen.getByRole('button', { name: 'set' }).click()
    })

    expect(onRender).toHaveBeenLastCalledWith({
      age: 18,
      name: 'Ron',
    })

    await waitFor(() => {
      expect(routerAsPath).toEqual('?name=Ron')
    })

    await actReact(async () => {
      screen.getByRole('button', { name: 'reset' }).click()
    })
    expect(routerAsPath).toEqual('')
  })

  test(`using setter from hook directly`, async () => {
    let routerAsPath = ''
    const { result, unmount } = renderHook(() => {
      routerAsPath = useRouter().asPath
      return {
        a: useQueryState('age', 18),
        b: useQueryState('names', [] as string[]),
      }
    })

    const { a: age, b: names } = unwrapABResult(result)

    // default
    expect(result.error).toBe(undefined)
    expect(routerAsPath).toEqual('')
    expect(age.value).toEqual(18)
    expect(names.value).toEqual([])

    // set next values:
    await act(async () => {
      age.setValue(31)
      names.setValue([])
    })

    // check new value
    expect(result.error).toBe(undefined)
    expect(routerAsPath).toEqual('?age=31')
    expect(age.value).toEqual(31)
    expect(names.value).toEqual([])

    // reset to original values
    await act(async () => {
      age.setValue(18)
      names.setValue([])
    })

    // check successful reset
    expect(result.error).toBe(undefined)
    expect(routerAsPath).toEqual('')
    expect(age.value).toEqual(18)
    expect(names.value).toEqual([])

    unmount()
  })
})
