import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Start</Link>
        </li>
        <li>
          <Link to="/query-reducer">useQueryReducer</Link>
        </li>
        <li>
          <Link to="/location-state">LocationState</Link>
        </li>
        <li>
          <Link to="/array-demo">Array</Link>
        </li>
      </ul>
    </nav>
  )
}
