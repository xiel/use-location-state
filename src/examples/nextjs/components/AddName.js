import React, { memo, useState } from 'react'
import { useQueryState } from 'use-location-state/next'

export default memo(function AddName() {
  const [names, setNames] = useQueryState('names', [])
  const [name, nameSet] = useState('')

  return (
    <form
      onSubmit={(e) => {
        nameSet('')
        setNames(names.concat(name))
        e.preventDefault()
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
})
