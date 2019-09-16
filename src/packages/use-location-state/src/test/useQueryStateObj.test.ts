import { act, renderHook } from '@testing-library/react-hooks'
import { cleanup } from '@testing-library/react'
import { useHashQueryStateObj } from '../hooks/useHashQueryState'
import { useHashQueryStringInterface } from '../hooks/useHashQueryStringInterface'
import useQueryStateObj from '../hooks/useQueryStateObj'
import { unwrapResult } from './test-helpers'

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
    const { result } = renderHook(
      props => {
        const hashQSI = useHashQueryStringInterface()
        return useQueryStateObj(props, { queryStringInterface: hashQSI })
      },
      {
        initialProps: { name: 'Sarah' },
      }
    )

    const name = unwrapResult(result)

    expect(name.value).toEqual({ name: 'Sarah' })
    act(() => name.setValue({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual({ name: 'Kim' })
    act(() => name.setValue({ name: 'Sarah' }))
    expect(window.location.hash).toEqual('')
    expect(name.value).toEqual({ name: 'Sarah' })
  })
})

describe('useHashQueryStateObj hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(props => useHashQueryStateObj(props), {
      initialProps: { name: 'Sarah' },
    })

    const name = unwrapResult(result)

    expect(name.value).toEqual({ name: 'Sarah' })
    act(() => name.setValue({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual({ name: 'Kim' })
    act(() => name.setValue({ name: 'Sarah' }))
    expect(window.location.hash).toEqual('')
    expect(name.value).toEqual({ name: 'Sarah' })
  })
})
