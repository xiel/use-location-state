import React from 'react'

interface Props {
  queryState?: Record<string, string | number>
}

export default function QueryStateDisplay({ queryState = {} }: Props) {
  return (
    <div>
      <h3>Current queryState:</h3>
      <pre data-testid="pre-query-state">{JSON.stringify(queryState, null, ' ')}</pre>
    </div>
  )
}
