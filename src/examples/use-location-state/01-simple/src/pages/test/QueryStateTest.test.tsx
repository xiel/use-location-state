import React from 'react'
import { cleanup, fireEvent, render, waitForDomChange } from 'react-testing-library'
import QueryStateTest from '../QueryStateTest'

const location = window.location

// reset jest mocked hash
beforeAll(() => {
  location.hash = ''
})

afterEach(() => {
  cleanup()
  location.hash = ''
})

describe('QueryStateTest', () => {
  test('QueryStateTest renders without crash/loop', async () => {
    expect(render(<QueryStateTest />))
  })

  test('can set name with button', async () => {
    const { getByText, getByTestId } = render(<QueryStateTest />)
    expect(location.hash).toEqual('')

    // should put new names into the hash (and age default value comes along)
    fireEvent.click(getByText('name: "Felix"'))
    expect(location.hash).toEqual('#age=25&name=Felix')
    await waitForDomChange()
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    fireEvent.click(getByText('name: "Kim"'))
    expect(location.hash).toEqual('#age=25&name=Kim')
    await waitForDomChange()
    expect(getByTestId('pre-query-state')).toMatchSnapshot()

    // set back to default value, so it should remove name value from hash
    fireEvent.click(getByText('name: "Sarah" (default value)'))
    expect(location.hash).toEqual('#age=25')
    await waitForDomChange()
    expect(getByTestId('pre-query-state')).toMatchSnapshot()
  })

  test('can set name with text field', async () => {
    const { getByLabelText } = render(<QueryStateTest />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('name:'), { target: { value: 'Mila' } })
    expect(location.hash).toEqual('#age=25&name=Mila')
  })

  test('can set age with button', async () => {
    const { getByText } = render(<QueryStateTest />)
    expect(location.hash).toEqual('')

    fireEvent.click(getByText('age: 30'))
    expect(location.hash).toEqual('#age=30&name=Sarah')

    fireEvent.click(getByText('age: 45'))
    expect(location.hash).toEqual('#age=45&name=Sarah')

    fireEvent.click(getByText('age: 25'))
    expect(location.hash).toEqual('#name=Sarah')
  })

  test('can set age with text field', async () => {
    const { getByLabelText } = render(<QueryStateTest />)
    expect(location.hash).toEqual('')
    fireEvent.change(getByLabelText('age:'), { target: { value: '33' } })
    expect(location.hash).toEqual('#age=33&name=Sarah')
  })

  test('can set name & age with button', async () => {
    const { getByText } = render(<QueryStateTest />)
    expect(location.hash).toEqual('')

    fireEvent.click(getByText('name: "Felix", age: 30'))
    expect(location.hash).toEqual('#age=30&name=Felix')

    fireEvent.click(getByText('name: "Kim", age: 45'))
    expect(location.hash).toEqual('#age=45&name=Kim')

    // set back to default value
    fireEvent.click(getByText('name: "Sarah", age: 25'))
    expect(location.hash).toEqual('')
  })
})
