import React from 'react'
import { useLocationState } from 'use-location-state'
import QueryStateDisplay from '../components/QueryStateDisplay'
import LocationStateCheckbox from '../components/LocationStateCheckbox'

export default function LocationStateDemo() {
  const [name, setName, resetName] = useLocationState('name', 'Sarah')
  const [age, setAge, resetAge] = useLocationState('age', 25)
  const [date, setDate] = useLocationState('date', new Date('2019-01-01'))
  const [active] = useLocationState('active', false)

  return (
    <div>
      <h2>Intro</h2>

      <QueryStateDisplay
        queryState={{
          name,
          age,
          active,
          date,
        }}
      />

      <h4>name</h4>
      <fieldset>
        <label htmlFor="input-name">name:</label>
        <input id="input-name" type="text" value={name} onChange={e => setName(e.target.value)} />
        <button type="button" onClick={() => setName('Felix')}>
          name: "Felix"
        </button>
        <button type="button" onClick={() => setName('Kim')}>
          name: "Kim"
        </button>
        <button type="button" onClick={() => setName('Sarah')}>
          name: "Sarah" (default value)
        </button>
      </fieldset>

      <h4>Age</h4>
      <fieldset>
        <label htmlFor="input-age">age:</label>
        <input
          id="input-age"
          type="number"
          value={age}
          onChange={e => setAge(Number(e.target.value))}
        />
        <button type="button" onClick={() => setAge(30)}>
          age: 30
        </button>
        <button type="button" onClick={() => setAge(45)}>
          age: 45
        </button>
        <button type="button" onClick={() => setAge(25)}>
          age: 25
        </button>
      </fieldset>

      <h4>name & age (at the same time)</h4>
      <fieldset>
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
          name: "Sarah", age: 25 (default)
        </button>
      </fieldset>

      <h4>active</h4>
      <fieldset>
        <LocationStateCheckbox />
        <LocationStateCheckbox method="push" />
      </fieldset>

      <h4>Date</h4>
      <fieldset>
        <label htmlFor="input-date">date:</label>
        <input
          id="input-date"
          type="date"
          value={(date.toJSON() && date.toJSON().slice(0, 10)) || ''}
          onChange={e => setDate(new Date(e.target.value))}
        />
      </fieldset>
    </div>
  )
}
