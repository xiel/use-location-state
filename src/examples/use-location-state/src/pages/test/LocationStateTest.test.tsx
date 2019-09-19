import React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import LocationStateDemo from '../LocationStateDemo'

afterEach(() => {
  cleanup()
})

describe('LocationStateDemo', () => {
  test('LocationStateDemo renders without crash/loop', () => {
    expect(render(<LocationStateDemo />))
  })

  test('can set name with button', () => {
    const { getByText, getByTestId } = render(<LocationStateDemo />)

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
    const { getByLabelText } = render(<LocationStateDemo />)
    fireEvent.change(getByLabelText('name:'), { target: { value: 'Mila' } })
  })

  test('can set age with button', () => {
    const { getByText, getByTestId } = render(<LocationStateDemo />)
    act(() => void fireEvent.click(getByText('age: 30')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    act(() => void fireEvent.click(getByText('age: 45')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    act(() => void fireEvent.click(getByText('age: 25')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set age with text field', () => {
    const { getByLabelText, getByTestId } = render(<LocationStateDemo />)
    fireEvent.change(getByLabelText('age:'), { target: { value: '33' } })
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name & age with button', () => {
    const { getByText, getByTestId } = render(<LocationStateDemo />)

    act(() => void fireEvent.click(getByText('name: "Felix", age: 30')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    act(() => void fireEvent.click(getByText('name: "Kim", age: 45')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    // set back to default value
    act(() => void fireEvent.click(getByText('name: "Sarah", age: 25 (default)')))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set active with checkbox', () => {
    const { getByLabelText, getByTestId } = render(<LocationStateDemo />)
    fireEvent.click(getByLabelText('active'))
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set active with checkbox - push', () => {
    const replaceState = spyOn(window.history, 'replaceState')
    const pushState = spyOn(window.history, 'pushState')
    const { getByLabelText, getByTestId } = render(<LocationStateDemo />)
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(0)
    fireEvent.click(getByLabelText('active (method: push)'))
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(1)
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set date with date field', () => {
    const { getByLabelText, getByTestId } = render(<LocationStateDemo />)
    fireEvent.change(getByLabelText('date:'), { target: { value: '2019-05-01' } })
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set null in date field', () => {
    const { getByLabelText, getByTestId } = render(<LocationStateDemo />)
    fireEvent.change(getByLabelText('date:'), { target: { value: null } })
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
    fireEvent.change(getByLabelText('date:'), { target: { value: '' } })
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })
})
