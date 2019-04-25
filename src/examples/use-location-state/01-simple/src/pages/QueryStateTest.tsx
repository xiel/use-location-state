import React from 'react'
import { useLocationHashQueryState } from 'use-location-state'
import QueryStateDisplay from '../components/QueryStateDisplay'

interface Props {}

export default function QueryStateTest(props: Props) {
  const [name, setName] = useLocationHashQueryState('name', 'Sarah')
  const [age, setAge] = useLocationHashQueryState('age', 25)

  return (
    <div>
      <h1>useQueryState</h1>
      <h2>Intro</h2>
      <h3>
        <abbr title="a brief summary">tl;dr</abbr>
      </h3>
      <p>Link to longer blog post</p>

      <QueryStateDisplay
        queryState={{
          name,
          age,
        }}
      />

      <h4>name</h4>
      <p>
        <button type="button" onClick={() => setName('Felix')}>
          name: "Felix"
        </button>
        <button type="button" onClick={() => setName('Kim')}>
          name: "Kim"
        </button>
        <button type="button" onClick={() => setName('Sarah')}>
          name: "Sarah" (default value)
        </button>
        <label htmlFor="input-name">name:</label>
        <input
          id="input-name"
          type="text"
          placeholder={name}
          onChange={e => setName(e.target.value)}
        />
      </p>

      <h4>Age</h4>
      <p>
        <button type="button" onClick={() => setAge(30)}>
          age: 30
        </button>
        <button type="button" onClick={() => setAge(45)}>
          age: 45
        </button>
        <button type="button" onClick={() => setAge(25)}>
          age: 25
        </button>
        <label htmlFor="input-age">age:</label>
        <input
          id="input-age"
          type="text"
          placeholder={`${age}`}
          onChange={e => setAge(parseFloat(e.target.value))}
        />
      </p>

      <h4>name & age</h4>
      <p>
        <button
          type="button"
          onClick={() => {
            setName('Felix')
            setAge(30)
          }}
        >
          name: "Felix", age: 30
        </button>
        <button
          type="button"
          onClick={() => {
            setName('Kim')
            setAge(45)
          }}
        >
          name: "Kim", age: 45
        </button>
        <button
          type="button"
          onClick={() => {
            setName('Sarah')
            setAge(25)
          }}
        >
          name: "Sarah", age: 25
        </button>
      </p>
    </div>
  )
}
