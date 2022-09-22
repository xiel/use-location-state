import Link from 'next/link'
import React from 'react'

import NamesList from '../components/NamesList'
import AddName from '../components/AddName'
import { useQueryState } from 'use-location-state/next'

// Give SSR as access to query parameter (otherwise react logs a hydration mismatch warning)
export { getServerSideProps } from 'use-location-state/next'

export default function IndexPage() {
  const [count, setCount] = useQueryState('count', 0)

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
