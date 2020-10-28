import React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import QueryStateDemo from '../QueryStateDemo'
import QueryStateDisplay from '../../components/QueryStateDisplay'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  cleanup()
  location.hash = ''
})

describe('QueryStateDemo', () => {
  test('QueryStateDemo renders without crash/loop', () => {
    expect(render(<QueryStateDemo />))
  })

  test('can set name with button', () => {
    const { getByText, getByTestId } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')

    // should put new names into the hash (and age default value comes along)
    act(() => void fireEvent.click(getByText('name: "Felix"')))
    expect(location.hash).toEqual('#name=Felix')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    act(() => void fireEvent.click(getByText('name: "Kim"')))
    expect(location.hash).toEqual('#name=Kim')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // set back to default value, so it should remove name value from hash
    act(() => void fireEvent.click(getByText('name: "Sarah" (default value)')))
    expect(location.hash).toEqual('')
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name with text field', () => {
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('name:'), { target: { value: 'Mila' } })
    expect(location.hash).toEqual('#name=Mila')
  })

  test('can set age with button', () => {
    const { getByText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')

    act(() => void fireEvent.click(getByText('age: 30')))
    expect(location.hash).toEqual('#age=30')

    act(() => void fireEvent.click(getByText('age: 45')))
    expect(location.hash).toEqual('#age=45')

    act(() => void fireEvent.click(getByText('age: 25')))
    expect(location.hash).toEqual('')
  })

  test('can set age with text field', () => {
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('age:'), { target: { value: '33' } })
    expect(location.hash).toEqual('#age=33')
  })

  test('can set name & age with button', () => {
    const { getByText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')

    act(() => void fireEvent.click(getByText('name: "Felix", age: 30')))
    expect(location.hash).toEqual('#age=30&name=Felix')

    act(() => void fireEvent.click(getByText('name: "Kim", age: 45')))
    expect(location.hash).toEqual('#age=45&name=Kim')

    // set back to default value
    act(
      () => void fireEvent.click(getByText('name: "Sarah", age: 25 (default)'))
    )
    expect(location.hash).toEqual('')
  })

  test('can set active with checkbox', () => {
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')

    fireEvent.click(getByLabelText('active'))
    expect(location.hash).toEqual('#active=true')
  })

  test('can set active with checkbox - push', () => {
    const replaceState = spyOn(window.history, 'replaceState')
    const pushState = spyOn(window.history, 'pushState')
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(0)
    fireEvent.click(getByLabelText('active (method: push)'))
    expect(replaceState).toBeCalledTimes(0)
    expect(pushState).toBeCalledTimes(1)
    expect(pushState).toHaveBeenCalledWith(undefined, '', '#active=true')
  })

  test('can set date with date field', () => {
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('date:'), {
      target: { value: '2019-05-01' },
    })
    expect(location.hash).toEqual('#date=2019-05-01T00%3A00%3A00.000Z')
  })

  test('can reset date with date field', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
    const { getByLabelText } = render(<QueryStateDemo />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('date:'), {
      target: { value: '2019-05-01' },
    })
    expect(location.hash).toEqual('#date=2019-05-01T00%3A00%3A00.000Z')
    fireEvent.change(getByLabelText('date:'), { target: { value: null } })
    expect(location.hash).toEqual('')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })
})

test('QueryStateDisplay', () => {
  expect(render(<QueryStateDisplay />))
})
