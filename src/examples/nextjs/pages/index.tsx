import Link from 'next/link'
import React from 'react'
import NamesList from '../components/NamesList'
import AddName from '../components/AddName'

import { useQueryState } from 'use-location-state/next'

// Page must be server rendered otherwise React warns about a hydration mismatch
// You can use your own getServerSideProps function or use this empty one
export { getServerSideProps } from 'use-location-state/next'

export default function Page() {
  const [count, setCount] = useQueryState('count', 0)

  return (
    <div>
      <h1>Hello World.</h1>

      <hr />

      <AddName />
      <NamesList />

      <hr />

      <button onClick={() => setCount(count + 1)}>increase {count}</button>

      <hr />

      <Link href="/">
        <a>Reset</a>
      </Link>
    </div>
  )
}
