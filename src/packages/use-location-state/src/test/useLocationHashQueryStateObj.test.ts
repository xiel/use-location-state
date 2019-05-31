import { act, renderHook } from 'react-hooks-testing-library'
import { cleanup } from '@testing-library/react'
import { useHashQueryStateObj } from '../hooks/useHashQueryState'
import { useLocationHashQueryStringInterface } from '../hooks/useLocationHashQueryStringInterface'
import useQueryStateObj from '../hooks/useQueryStateObj'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
  cleanup()
})

describe('useQueryStateObj hook', () => {
  it('should work with passed HashQueryStringInterface', () => {
    const hashQSI = renderHook(() => useLocationHashQueryStringInterface())
    const { result } = renderHook(
      props => useQueryStateObj(props, { queryStringInterface: hashQSI.result.current }),
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

describe('useHashQueryStateObj hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(props => useHashQueryStateObj(props), {
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
