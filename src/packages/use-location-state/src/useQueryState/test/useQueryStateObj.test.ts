import { cleanup } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useHashQueryStateObj } from '../useHashQueryState'
import { useHashQueryStringInterface } from '../useHashQueryStringInterface'
import { useQueryStateObj } from '../useQueryStateObj'
import { unwrapResult } from 'use-location-state-test-helpers/test-helpers'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
  cleanup()
})

describe('useQueryStateObj hook', () => {
  it('should work with passed HashQueryStringInterface', async () => {
    const { result, unmount } = renderHook(
      (props) => {
        const hashQSI = useHashQueryStringInterface()
        return useQueryStateObj(props, { queryStringInterface: hashQSI })
      },
      {
        initialProps: { name: 'Sarah' },
      }
    )

    const name = unwrapResult(result)

    expect(name.value).toEqual({ name: 'Sarah' })
    await act(async () => name.setValue({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual({ name: 'Kim' })
    await act(async () => name.setValue({ name: 'Sarah' }))
    expect(window.location.hash).toEqual('')
    expect(name.value).toEqual({ name: 'Sarah' })
    act(() => void unmount())
  })
})

describe('useHashQueryStateObj hook', () => {
  it('should work with internal HashQueryStringInterface', async () => {
    const { result, unmount } = renderHook(
      (props) => useHashQueryStateObj(props),
      {
        initialProps: { name: 'Sarah' },
      }
    )

    const name = unwrapResult(result)

    expect(name.value).toEqual({ name: 'Sarah' })
    await act(async () => name.setValue({ name: 'Kim' }))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual({ name: 'Kim' })
    await act(async () => name.setValue({ name: 'Sarah' }))
    expect(window.location.hash).toEqual('')
    expect(name.value).toEqual({ name: 'Sarah' })
    act(() => void unmount())
  })
})
