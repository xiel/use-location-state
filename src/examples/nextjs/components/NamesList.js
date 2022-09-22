import React, { memo } from 'react'
import { useQueryState } from 'use-location-state/next'

export default memo(function NamesList() {
  const [names] = useQueryState('names', [])

  return (
    <ul>
      {names.map((name, i) => (
        <li key={name + i}>{name}</li>
      ))}
    </ul>
  )
})
