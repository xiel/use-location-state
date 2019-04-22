import { act, renderHook } from 'react-hooks-testing-library'
import { useLocationQueryParams, LocationSearch } from '..'

// QueryStringInterface
const getSetQSI: LocationSearch = {
  get search() {
    return location.hash
  },
  set search(newSearch) {
    location.hash = newSearch
  },
}

const getSetFuncsQSI: LocationSearch = {
  getSearch: () => location.hash,
  setSearch: newSearch => (location.hash = newSearch),
}

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  location.hash = ''
})

describe('useLocationQueryParams hook with hash GetSetQueryStringInterface', () => {
  it('TODO: ...', () => {
    const { result } = renderHook(props => useLocationQueryParams(props, getSetQSI), {
      initialProps: { name: 'Sarah' },
    })
    expect(result.current.queryState).toEqual({ name: 'Sarah' })

    act(() => result.current.setQueryState({ name: 'Kim' }))

    expect(location.hash).toEqual('#name=Kim')
    expect(result.current.queryState).toEqual({ name: 'Kim' })
  })
})

describe('useLocationQueryParams hook using getSetFuncsQSI', () => {
  it('TODO: ...', () => {
    const { result } = renderHook(props => useLocationQueryParams(props, getSetFuncsQSI), {
      initialProps: { name: 'Sarah' },
    })
    expect(result.current.queryState).toEqual({ name: 'Sarah' })

    act(() => result.current.setQueryState({ name: 'Kim' }))

    expect(location.hash).toEqual('#name=Kim')
    expect(result.current.queryState).toEqual({ name: 'Kim' })
  })
})
