import React from 'react'
import { useLocationQueryParams, useLocationHashQueryStringInterface } from 'use-location-state'

interface Props {}

const queryStateDefault = { name: 'Sarah', age: 25 }

export default function QueryStateTest(props: Props) {
  const locationHashQueryStringInterface = useLocationHashQueryStringInterface()
  const { queryState, setQueryState } = useLocationQueryParams(queryStateDefault, {
    queryStringInterface: locationHashQueryStringInterface,
  })

  return (
    <div>
      <h3>Current queryState:</h3>
      <pre className="pre-query-state">{JSON.stringify(queryState, null, ' ')}</pre>

      <h4>name</h4>
      <p>
        <button type="button" onClick={() => setQueryState({ name: 'Felix' })}>
          set name: "Felix"
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Kim' })}>
          set name: "Kim"
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Sarah' })}>
          set name: "Sarah" (default value)
        </button>
        <input
          type="text"
          placeholder={`${queryState.name}`}
          onChange={e => setQueryState({ name: e.target.value })}
        />
        <button type="button">☑️</button>
      </p>

      <h4>Age</h4>
      <p>
        <button type="button" onClick={() => setQueryState({ age: 30 })}>
          age: 30
        </button>
        <button type="button" onClick={() => setQueryState({ age: 45 })}>
          age: 45
        </button>
        <button type="button" onClick={() => setQueryState({ age: 25 })}>
          age: 25
        </button>
        <input
          type="text"
          placeholder={`${queryState.age}`}
          onChange={e => setQueryState({ age: parseFloat(e.target.value) })}
        />
        <button type="button">☑️</button>
      </p>

      <h4>name & age</h4>
      <p>
        <button type="button" onClick={() => setQueryState({ name: 'Felix', age: 30 })}>
          name: 'Felix', age: 30
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Kim', age: 45 })}>
          name: 'Kim', age: 45
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Sarah', age: 25 })}>
          name: 'Sarah', age: 25
        </button>
      </p>
    </div>
  )
}
