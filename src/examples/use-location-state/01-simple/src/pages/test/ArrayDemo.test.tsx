import React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import ArrayDemo from '../ArrayDemo'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  cleanup()
  location.hash = ''
})

describe('ArrayDemo', () => {
  test('ArrayDemo renders without crash/loop', async () => {
    expect(render(<ArrayDemo />))
  })

  test('can enable tag using button', async () => {
    const { getByLabelText } = render(<ArrayDemo />)
    expect(location.hash).toEqual('')

    // should put new names into the hash (and age default value comes along)
    fireEvent.click(getByLabelText('Tag 1'))
    expect(location.hash).toEqual('#tags=' + encodeURIComponent(JSON.stringify(['tag-1'])))
    fireEvent.click(getByLabelText('Tag 2'))
    fireEvent.click(getByLabelText('Tag 3'))
    expect(location.hash).toEqual(
      '#tags=' + encodeURIComponent(JSON.stringify(['tag-1', 'tag-2', 'tag-3']))
    )
    fireEvent.click(getByLabelText('Tag 1'))
    expect(location.hash).toEqual('#tags=' + encodeURIComponent(JSON.stringify(['tag-2', 'tag-3'])))
  })
})
