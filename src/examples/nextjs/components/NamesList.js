import { memo } from 'react'
import { useNextQueryState } from '../hooks/useNextQueryState'

export default memo(function NamesList() {
  const [names] = useNextQueryState('names', [])

  return (
    <ul>
      {names.map((name, i) => (
        <li key={name + i}>{name}</li>
      ))}
    </ul>
  )
})
