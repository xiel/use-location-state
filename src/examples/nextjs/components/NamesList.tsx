import React from 'react'
import { useQueryState } from 'use-location-state/next'

export default function NamesList() {
  const [names, setNames] = useQueryState('names', [])

  return (
    <ul>
      {names.map((name, nameIndex) => (
        <li key={name + nameIndex}>
          {name}{' '}
          <button
            type="button"
            onClick={() => {
              setNames(
                names.filter(
                  (_, filterItemIndex) => nameIndex !== filterItemIndex
                )
              )
            }}
          >
            remove
          </button>
        </li>
      ))}
    </ul>
  )
}
