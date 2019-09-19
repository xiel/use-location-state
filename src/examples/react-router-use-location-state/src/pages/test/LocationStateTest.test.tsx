import React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import LocationStateDemo from '../LocationStateDemo'
import QueryStateDisplay from '../../components/QueryStateDisplay'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  cleanup()
})

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('LocationStateDemo', () => {
  test('LocationStateDemo renders without crash/loop', () => {
    expect(
      render(
        <Router>
          <Route path="/" component={LocationStateDemo} />
        </Router>
      )
    )
  })

  test('can set name with button', () => {
    const { getByText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // should put new names into the hash (and age default value comes along)
    act(() => void fireEvent.click(getByText('name: "Felix"')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('name: "Kim"')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // set back to default value, so it should remove name value from hash
    act(() => void fireEvent.click(getByText('name: "Sarah" (default value)')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name with text field', () => {
    const { getByLabelText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    act(() => void fireEvent.change(getByLabelText('name:'), { target: { value: 'Mila' } }))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set age with button', () => {
    const { getByText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('age: 30')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('age: 45')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('age: 25')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set age with text field', () => {
    const { getByLabelText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    act(() => void fireEvent.change(getByLabelText('age:'), { target: { value: '33' } }))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name & age with button', () => {
    const { getByText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('name: "Felix", age: 30')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('name: "Kim", age: 45')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // set back to default value
    act(() => void fireEvent.click(getByText('name: "Sarah", age: 25')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set active with checkbox', () => {
    const { getByLabelText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    fireEvent.click(getByLabelText('active'))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set active with checkbox - push', () => {
    const replaceState = spyOn(window.history, 'replaceState')
    const pushState = spyOn(window.history, 'pushState')
    const { getByLabelText, getByTestId } = render(
      <Router>
        <Route path="/" component={LocationStateDemo} />
      </Router>
    )
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(0)
    fireEvent.click(getByLabelText('active (method: push)'))
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(1)
  })
})

test('QueryStateDisplay', () => {
  expect(render(<QueryStateDisplay />))
})
