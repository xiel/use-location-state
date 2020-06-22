import { memo, useState } from 'react'
import { useNextQueryState } from '../hooks/useNextQueryState'

export default memo(function AddName() {
  const [names, setNames] = useNextQueryState('names', [])
  const [name, nameSet] = useState('')

  return (
    <form
      onSubmit={e => {
        nameSet('')
        setNames(names.concat(name))
        e.preventDefault()
      }}
    >
      <label>
        Add Name:{' '}
        <input autoFocus type="text" value={name} onChange={e => nameSet(e.target.value)} />
      </label>
    </form>
  )
})
