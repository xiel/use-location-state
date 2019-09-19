import { renderHook } from '@testing-library/react-hooks'
import { useQueryState } from '../../use-location-state'
import { asyncAct, unwrapResult } from 'use-location-state-test-helpers/test-helpers'
import { cleanup } from '@testing-library/react'

// reset jest mocked hash
beforeAll(() => {
  window.location.hash = ''
})

afterEach(() => {
  cleanup()
})

describe('method - replace', () => {
  it('should not create new history - default/replace', async () => {
    const { result, unmount } = renderHook(
      ({ itemName, defaultValue }) => useQueryState(itemName, defaultValue),
      {
        initialProps: { itemName: 'name', defaultValue: 'Sarah' },
      }
    )
    const name = unwrapResult(result)
    expect(name.value).toEqual('Sarah')
    expect(window.history.length).toEqual(1)

    await asyncAct(async () => void name.setValue('Kim'))

    expect(window.location.hash).toEqual('#name=Kim')
    expect(name.value).toEqual('Kim')
    expect(window.history.length).toEqual(1)
    unmount()
  })
})
