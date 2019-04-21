import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import QueryStateTest from './QueryStateTest'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <QueryStateTest />
        </header>
      </div>
    )
  }
}

export default App
