import { act, renderHook } from 'react-hooks-testing-library'
import { useLocationQueryState, useLocationHashQueryStringInterface } from './use-location-state'

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  location.hash = ''
})

describe('useLocationQueryState hook with hash GetSetQueryStringInterface', () => {
  it('TODO: ...', () => {
    const hashQSI = renderHook(() => useLocationHashQueryStringInterface())
    const { result } = renderHook(
      props => useLocationQueryState(props, { queryStringInterface: hashQSI.result.current }),
      {
        initialProps: { name: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual({ name: 'Sarah' })

    act(() => result.current[1]({ name: 'Kim' }))

    expect(location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual({ name: 'Kim' })
  })
})
