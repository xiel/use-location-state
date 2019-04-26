import { act, renderHook } from 'react-hooks-testing-library'
import { useLocationHashQueryState } from '../useLocationHashQueryState'
import { cleanup } from 'react-testing-library'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
  cleanup()
})

describe('useLocationHashQueryState hook', () => {
  it('should work with internal HashQueryStringInterface', () => {
    const { result } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual('Sarah')
    act(() => result.current[1]('Kim'))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual('Kim')
  })

  it('should reset hash when default', () => {
    const { result } = renderHook(
      ({ itemName, defaultValue }) => useLocationHashQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )

    expect(result.current[0]).toEqual('Sarah')

    act(() => result.current[1]('Kim'))
    expect(window.location.hash).toEqual('#name=Kim')
    expect(result.current[0]).toEqual('Kim')

    act(() => result.current[1]('Sarah'))
    expect(window.location.hash).toEqual('')
    expect(result.current[0]).toEqual('Sarah')
  })


})

describe('enforce types', () => {

  test.todo('string')
  test.todo('number')
  test.todo('boolean')
  test.todo('array')

})
