import { act, renderHook } from 'react-hooks-testing-library'
import {
  useLocationQueryState,
  useLocationHashQueryState,
  useLocationHashQueryStringInterface,
  useLocationHashQueryStateItem,
} from './use-location-state'
import { cleanup } from 'react-testing-library'

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  location.hash = ''
  cleanup()
})

describe('useLocationQueryState hook', () => {
  it('should work with passed HashQueryStringInterface', () => {
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

describe('useLocationHashQueryState hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(props => useLocationHashQueryState(props), {
      initialProps: { name: 'Sarah' },
    })

    expect(result.current[0]).toEqual({ name: 'Sarah' })
    act(() => result.current[1]({ name: 'Kim' }))
    expect(location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual({ name: 'Kim' })
  })
})

describe('useLocationHashQueryStateItem hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryStateItem(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual('Sarah')
    act(() => result.current[1]('Kim'))
    expect(location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual('Kim')
  })

  it('should reset hash when default', () => {
    const { result } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryStateItem(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual('Sarah')

    act(() => result.current[1]('Kim'))
    expect(location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual('Kim')

    act(() => result.current[1]('Sarah'))
    expect(location.hash).toEqual('')
    expect(result.current[0]).toEqual('Sarah')
  })
})
