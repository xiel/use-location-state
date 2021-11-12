import React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ArrayDemo from '../ArrayDemo'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  cleanup()
})

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('ArrayDemo', () => {
  test('ArrayDemo renders without crash/loop', async () => {
    expect(
      render(
        <Router>
          <Routes>
            <Route path="/" element={<ArrayDemo />} />
          </Routes>
        </Router>
      )
    )
  })

  test('can enable tag using button', async () => {
    const { getByLabelText } = render(
      <Router>
        <Routes>
          <Route path="/" element={<ArrayDemo />} />
        </Routes>
      </Router>
    )
    expect(location.search).toEqual('')

    // should put new names into the hash (and age default value comes along)
    act(() => void fireEvent.click(getByLabelText('Tag 1')))
    expect(location.search).toEqual('?tags=tag1')
    act(() => void fireEvent.click(getByLabelText('Tag 2')))
    act(() => void fireEvent.click(getByLabelText('Tag 3')))
    expect(location.search).toEqual('?tags=tag1&tags=tag2&tags=tag3')
    act(() => void fireEvent.click(getByLabelText('Tag 1')))
    expect(location.search).toEqual('?tags=tag2&tags=tag3')
  })
})
