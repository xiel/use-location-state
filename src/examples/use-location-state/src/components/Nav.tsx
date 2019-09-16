import React from 'react'

interface Props {}

export default function Nav(props: Props) {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Start</a>
        </li>
        <li>
          <a href="/location-state">LocationState</a>
        </li>
        <li>
          <a href="/array-demo">Array</a>
        </li>
      </ul>
    </nav>
  )
}
