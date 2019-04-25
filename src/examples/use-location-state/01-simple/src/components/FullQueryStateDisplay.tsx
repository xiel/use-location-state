import React from 'react'
import { useLocationHashQueryState } from 'use-location-state'

interface Props {
  defaultQueryState?: Record<string, string | number>
}

export default function FullQueryStateDisplay({ defaultQueryState }: Props) {
  const [queryState] = useLocationHashQueryState(defaultQueryState || {})

  return (
    <div>
      <h3>Current queryState:</h3>
      <pre data-testid="pre-query-state">{JSON.stringify(queryState, null, ' ')}</pre>
    </div>
  )
}
