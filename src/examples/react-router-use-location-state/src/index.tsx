import '@ungap/url-search-params'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './App'

export function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
