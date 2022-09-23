import { EMPTY_ARRAY_STRING } from 'query-state-core'
import { act, renderHook } from '@testing-library/react-hooks'
import { useQueryState, getServerSideProps, useQueryReducer } from '../next'
import * as NextExportsInRoot from '../../next'
import { unwrapResult } from 'use-location-state-test-helpers/test-helpers'
import mockRouter from 'next-router-mock'
import { useRouter } from 'next/router'

jest.mock('next/router', () => require('next-router-mock'))

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

    beforeEach(() => {
      mockRouter.setCurrentUrl('')
    })

    test(`should return default value and set newValue successfully`, () => {
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
      act(() => r.setValue(newValue))
      expect(routerAsPath).toEqual(newValueQueryString)
      expect(r.value).toEqual(newValue)
      expect(reducerState).toEqual(newValue)

      // back to default
      act(() => r.setValue(defaultValue))
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
