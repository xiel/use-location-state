import Link from 'next/link'
import React from 'react'

import NamesList from '../components/NamesList'
import AddName from '../components/AddName'
import { useNextQueryState } from '../hooks/useNextQueryState'

// give SSR as access to query parameter (otherwise react hydration warning)
export async function getServerSideProps(props) {
  return { props: {} }
}

export default function IndexPage() {
  const [count, setCount] = useNextQueryState('count', 0)

  return (
    <div>
      <h1>Hello World.</h1>
      <AddName />
      <NamesList />
      <button onClick={() => setCount(count + 1)}>increase {count}</button>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Reset</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}