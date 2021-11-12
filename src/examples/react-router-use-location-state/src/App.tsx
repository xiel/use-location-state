import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
// demo pages
import QueryStateDemo from './pages/QueryStateDemo'
import ArrayDemo from './pages/ArrayDemo'
import LocationStateDemo from './pages/LocationStateDemo'
import QueryReducerDemo from './pages/QueryReducer/QueryReducer'

export default function App() {
  return (
    <div className="page-wrapper">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<QueryStateDemo />} />
          <Route path="/location-state" element={<LocationStateDemo />} />
          <Route path="/array-demo" element={<ArrayDemo />} />
          <Route path="/query-reducer" element={<QueryReducerDemo />} />
        </Routes>
      </Router>
    </div>
  )
}
