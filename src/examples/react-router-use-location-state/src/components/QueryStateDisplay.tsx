import React from 'react'

interface Props {
  queryState?: Record<string, string | number | boolean>
}

export default function QueryStateDisplay({ queryState = {} }: Props) {
  return <pre data-testid="pre-query-state">{JSON.stringify(queryState, null, ' ')}</pre>
}
