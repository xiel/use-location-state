import React from 'react'
import { useLocationHashQueryState } from 'use-location-state'
import FullQueryStateDisplay from '../components/FullQueryStateDisplay'

interface Props {}

export default function QueryStateTest(props: Props) {
  const defaultQueryState = { name: 'Sarah', age: 25 }
  const [queryState, setQueryState] = useLocationHashQueryState(defaultQueryState)

  return (
    <div>
      <h1>useQueryState</h1>
      <h2>Intro</h2>
      <h3>
        <abbr title="a brief summary">tl;dr</abbr>
      </h3>
      <p>Link to longer blog post</p>

      <FullQueryStateDisplay defaultQueryState={defaultQueryState} />

      <h4>name</h4>
      <p>
        <button type="button" onClick={() => setQueryState({ name: 'Felix' })}>
          name: "Felix"
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Kim' })}>
          name: "Kim"
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Sarah' })}>
          name: "Sarah" (default value)
        </button>
        <label htmlFor="input-name">name:</label>
        <input
          id="input-name"
          type="text"
          placeholder={`${queryState.name}`}
          onChange={e => setQueryState({ name: e.target.value })}
        />
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
        <label htmlFor="input-age">age:</label>
        <input
          id="input-age"
          type="text"
          placeholder={`${queryState.age}`}
          onChange={e => setQueryState({ age: parseFloat(e.target.value) })}
        />
      </p>

      <h4>name & age</h4>
      <p>
        <button type="button" onClick={() => setQueryState({ name: 'Felix', age: 30 })}>
          name: "Felix", age: 30
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Kim', age: 45 })}>
          name: "Kim", age: 45
        </button>
        <button type="button" onClick={() => setQueryState({ name: 'Sarah', age: 25 })}>
          name: "Sarah", age: 25
        </button>
      </p>
    </div>
  )
}
