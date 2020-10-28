import React from 'react'
import ReactDOM from 'react-dom'
import { cleanup, render } from '@testing-library/react'
import App from '../App'

afterEach(() => {
  cleanup()
})

it('renders App.tsx without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('renders index.tsx without crashing', async () => {
  const div = document.createElement('div')
  div.id = 'root'
  document.documentElement.appendChild(div)
  const { render } = await import('../index')
  render()
})

describe.each`
  pathname             | title
  ${'/'}               | ${'Intro'}
  ${'/array-demo'}     | ${'Array Demo'}
  ${'/array-demo/'}    | ${'Array Demo'}
  ${'/query-reducer/'} | ${'useQueryReducer Demo'}
`(
  'allows some pathname tolerance @ $pathname expect $title',
  ({ pathname, title }) => {
    afterAll(() => {
      window.history.replaceState(null, '', '/')
    })

    test(`@ ${pathname} should render page with title ${title}`, () => {
      window.history.replaceState(null, '', pathname)
      const { getByText } = render(<App />)
      expect(getByText(title))
    })
  }
)
