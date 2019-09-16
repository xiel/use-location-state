import { useState } from 'react'
import { SetQueryStateItemFn } from '../useQueryState/types'

interface Props {}

export default function useLocationState<T>(
  itemName: string,
  defaultValue: T,
  locationStateOpts = {}
): [T, SetQueryStateItemFn<T>] {
  // itemName & defaultValue is not allowed to be changed after init
  ;[itemName] = useState(itemName)
  ;[defaultValue] = useState(defaultValue)

  let value = defaultValue

  const setLocationStateItem = () => {}

  return [value, setLocationStateItem]
}
