import { renderHook } from '@testing-library/react-hooks'
import { useQueryState } from '../use-location-state'
import { asyncAct, unwrapResult } from './test-helpers'
import { cleanup } from '@testing-library/react'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
  cleanup()
})

describe('method - push', () => {
  it('method push creates new entries in history with each change', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const name = unwrapResult(result)
    expect(name.value).toEqual('Sarah')
    expect(window.history.length).toEqual(1)

    await asyncAct(async () => void name.setValue('Kim', { method: 'push' }))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual('Kim')

    // method push creates new entries in history with each change
    expect(window.history.length).toEqual(2)
    unmount()
  })
})
