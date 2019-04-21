import React from 'react'
import ReactDOM from 'react-dom'
import QueryStateTest from './QueryStateTest'

it('renders QueryStateTest without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<QueryStateTest />, div)
  ReactDOM.unmountComponentAtNode(div)
})
