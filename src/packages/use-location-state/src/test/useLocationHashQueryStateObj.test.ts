import { act, renderHook } from 'react-hooks-testing-library'
import { cleanup } from 'react-testing-library'
import { useLocationHashQueryStateObj } from '../useLocationHashQueryState'
import { useLocationQueryStateObj } from '../useLocationQueryState'
import { useLocationHashQueryStringInterface } from '../hooks/useLocationHashQueryStringInterface'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
  cleanup()
})

describe('useLocationQueryStateObj hook', () => {
  it('should work with passed HashQueryStringInterface', () => {
    const hashQSI = renderHook(() => useLocationHashQueryStringInterface())
    const { result } = renderHook(
      props => useLocationQueryStateObj(props, { queryStringInterface: hashQSI.result.current }),
      {
        initialProps: { name: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual({ name: 'Sarah' })
    act(() => result.current[1]({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual({ name: 'Kim' })
  })
})

describe('useLocationHashQueryStateObj hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(props => useLocationHashQueryStateObj(props), {
      initialProps: { name: 'Sarah' },
    })

    expect(result.current[0]).toEqual({ name: 'Sarah' })
    act(() => result.current[1]({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual({ name: 'Kim' })
    act(() => result.current[1]({ name: 'Sarah' }))
    expect(window.location.hash).toEqual('')
    expect(result.current[0]).toEqual({ name: 'Sarah' })
  })
})
