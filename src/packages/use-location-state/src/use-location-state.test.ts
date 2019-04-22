import { act, renderHook } from 'react-hooks-testing-library'
import { useLocationQueryParams, useLocationHashQueryStringInterface } from './use-location-state'

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  location.hash = ''
})

describe('useLocationQueryParams hook with hash GetSetQueryStringInterface', () => {
  it('TODO: ...', () => {
    const hashQSI = renderHook(() => useLocationHashQueryStringInterface())
    const { result } = renderHook(
      props => useLocationQueryParams(props, { queryStringInterface: hashQSI.result.current }),
      {
        initialProps: { name: 'Sarah' },
      }
    )
    expect(result.current.queryState).toEqual({ name: 'Sarah' })

    act(() => result.current.setQueryState({ name: 'Kim' }))

    expect(location.hash).toEqual('#name=Kim')
    expect(result.current.queryState).toEqual({ name: 'Kim' })
  })
})
