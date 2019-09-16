import React, { memo } from 'react'
import { useLocationState } from 'use-location-state'

interface Props {
  name?: string
  method?: 'replace' | 'push'
}

export default memo(function LocationStateCheckbox({ name = 'active', method }: Props) {
  const [active, setActive] = useLocationState(name, false)

  return (
    <label>
      <input type="checkbox" checked={active} onChange={() => setActive(!active, { method })} />
      {name} {method && `(method: ${method})`}
    </label>
  )
})
