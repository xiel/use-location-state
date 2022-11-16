import Link from 'next/link'
import React from 'react'
import NamesList from '../components/NamesList'
import AddName from '../components/AddName'

import { useQueryState } from 'use-location-state/next'

// Page must be server rendered otherwise React warns about a hydration mismatch
// You can use your own getServerSideProps function or use this empty one
export { getServerSideProps } from 'use-location-state/next'

export default function Page() {
  const [countA, setCountA] = useQueryState('countA', 0)
  const [countB, setCountB] = useQueryState('countB', 0)

  return (
    <div>
      <h1>Hello World.</h1>

      <hr />

      <AddName />
      <NamesList />

      <hr />

      <button onClick={() => setCountA(countA + 1)}>
        increase A: {countA}
      </button>
      <button onClick={() => setCountB(countB + 1)}>
        increase B: {countB}
      </button>
      <button
        onClick={() => {
          setCountA((a) => a + 1)
          setCountB((a) => a + 1)
        }}
      >
        increase both
      </button>
      <button
        type="reset"
        onClick={() => {
          setCountA(0)
          setCountB(0)
        }}
      >
        reset counts
      </button>

      <hr />

      <Link href="/">
        <a>Reset All (link)</a>
      </Link>
    </div>
  )
}
