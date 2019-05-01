import React from 'react'
import Nav from './Nav'

interface Props {}

export default function Header(props: Props) {
  return (
    <header>
      <h1>useQueryState()</h1>
      <Nav />
    </header>
  )
}
