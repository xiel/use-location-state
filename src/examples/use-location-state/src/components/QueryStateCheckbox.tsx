import React, { memo } from 'react'
import { useQueryState } from 'use-location-state'

interface Props {
  name?: string
  method?: 'replace' | 'push'
}

export default memo(function QueryStateCheckbox({
  name = 'active',
  method,
}: Props) {
  const [active, setActive] = useQueryState(name, false)

  return (
    <label>
      <input
        type="checkbox"
        checked={active}
        onChange={() => setActive(!active, { method })}
      />
      {name} {method && `(method: ${method})`}
    </label>
  )
})
