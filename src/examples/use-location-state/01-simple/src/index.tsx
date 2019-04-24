import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

export function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
