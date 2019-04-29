import React from 'react'
import useLocationQueryState from 'use-location-state'
import QueryStateDisplay from '../components/QueryStateDisplay'

export default function QueryStateTest() {
  const [name, setName] = useLocationQueryState('name', 'Sarah')
  const [age, setAge] = useLocationQueryState('age', 25)
  const [active, setActive] = useLocationQueryState('active', false)

  return (
    <div>
      <h2>Intro</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid architecto, atque, corporis debitis esse.</p>
      <QueryStateDisplay
        queryState={{
          name,
          age,
          active,
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
          value={name}
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
          value={`${age}`}
          onChange={e => setAge(Number(e.target.value))}
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
      <h4>active</h4>
      <label htmlFor="checkbox-active">
        active
      </label>
      <input id="checkbox-active" type="checkbox" checked={active} onChange={() => setActive(!active)} />
    </div>
  )
}
