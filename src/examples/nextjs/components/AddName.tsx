import React, { useState } from 'react'
import { useQueryState } from 'use-location-state/next'

export default function AddName() {
  const [names, setNames] = useQueryState('names', [])
  const [name, nameSet] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!name) return
        nameSet('')
        setNames(names.concat(name))
      }}
    >
      <label>
        Add Name:{' '}
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => nameSet(e.target.value)}
        />
      </label>
      <button>add name</button>
    </form>
  )
}
