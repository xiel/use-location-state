import React from 'react'
import Header from './components/Header'
// demo pages
import QueryStateDemo from './pages/QueryStateDemo'
import ArrayDemo from './pages/ArrayDemo'

export default function App() {
  return (
    <div className="page-wrapper">
      <Header />
      <p>Hello</p>

      <QueryStateDemo />
      <ArrayDemo />
    </div>
  )
}
