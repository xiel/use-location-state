import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header'
// demo pages
import QueryStateDemo from './pages/QueryStateDemo'
import ArrayDemo from './pages/ArrayDemo'

export default function App() {
  return (
    <div className="page-wrapper">
      <Header />
      <Router>
        <Route path="/" exact component={QueryStateDemo} />
        <Route path="/array-demo" component={ArrayDemo} />
      </Router>
    </div>
  )
}
