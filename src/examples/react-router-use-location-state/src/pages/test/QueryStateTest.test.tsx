import React from 'react'
import { act, cleanup, fireEvent, render, wait } from 'react-testing-library'
import QueryStateDemo from '../QueryStateDemo'
import QueryStateDisplay from '../../components/QueryStateDisplay'
import { Route, BrowserRouter as Router } from 'react-router-dom'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  cleanup()
})

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('QueryStateDemo', () => {
  test('QueryStateDemo renders without crash/loop', () => {
    expect(
      render(
        <Router>
          <Route path="/" component={QueryStateDemo} />
        </Router>
      )
    )
  })

  test('can set name with button', () => {
    const { getByText, getByTestId } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')

    // should put new names into the hash (and age default value comes along)
    act(() => void fireEvent.click(getByText('name: "Felix"')))
    expect(location.search).toEqual('?name=Felix')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('name: "Kim"')))
    expect(location.search).toEqual('?name=Kim')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // set back to default value, so it should remove name value from hash
    act(() => void fireEvent.click(getByText('name: "Sarah" (default value)')))
    expect(location.search).toEqual('')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name with text field', () => {
    const { getByLabelText } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')
    act(() => void fireEvent.change(getByLabelText('name:'), { target: { value: 'Mila' } }))
    expect(location.search).toEqual('?name=Mila')
  })

  test('can set age with button', () => {
    const { getByText } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')

    act(() => void fireEvent.click(getByText('age: 30')))
    expect(location.search).toEqual('?age=30')

    act(() => void fireEvent.click(getByText('age: 45')))
    expect(location.search).toEqual('?age=45')

    act(() => void fireEvent.click(getByText('age: 25')))
    expect(location.search).toEqual('')
  })

  test('can set age with text field', () => {
    const { getByLabelText } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')
    act(() => void fireEvent.change(getByLabelText('age:'), { target: { value: '33' } }))
    expect(location.search).toEqual('?age=33')
  })

  test('can set name & age with button', () => {
    const { getByText } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')

    act(() => void fireEvent.click(getByText('name: "Felix", age: 30')))
    expect(location.search).toEqual('?age=30&name=Felix')

    act(() => void fireEvent.click(getByText('name: "Kim", age: 45')))
    expect(location.search).toEqual('?age=45&name=Kim')

    // set back to default value
    act(() => void fireEvent.click(getByText('name: "Sarah", age: 25')))
    expect(location.search).toEqual('')
  })

  test('can set name & age with button', () => {
    const { getByLabelText } = render(
      <Router>
        <Route path="/" component={QueryStateDemo} />
      </Router>
    )
    expect(location.search).toEqual('')

    fireEvent.click(getByLabelText('active'))
    expect(location.search).toEqual('?active=true')
  })
})

test('QueryStateDisplay', () => {
  expect(render(<QueryStateDisplay />))
})
