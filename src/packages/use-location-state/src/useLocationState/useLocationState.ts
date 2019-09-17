import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useLocationStateInterface from './useLocationStateInterface'
import { SetLocationState, SetLocationStateOptions } from './useLocationState.types'

interface Props {}

export default function useLocationState<T>(
  itemName: string,
  defaultValue: T,
  locationStateOpts = {}
): [T, SetLocationState<T>] {
  // itemName & defaultValue is not allowed to be changed after init
  ;[defaultValue] = useState(defaultValue)

  // item name gets a generated suffix based on defaultValue type, to make accidental clashes less likely
  ;[itemName] = useState(() => {
    const suffixObscurer = btoa || ((s: string) => s)
    const suffix = suffixObscurer(
      Array.isArray(defaultValue) ? 'array' : typeof defaultValue
    ).replace(/=/g, '')
    return `${itemName}__${suffix}`
  })

  // the interface to get/set the state
  const activeLSI = useLocationStateInterface()
  const ref = useRef({
    activeLSI,
  })

  const currentState = activeLSI.getLocationState()
  const value = useMemo(() => {
    let value = defaultValue
    if (itemName in currentState) {
      value = currentState[itemName] as any
    }
    return value
  }, [currentState, defaultValue, itemName])

  const resetLocationStateItem = useCallback(
    (opts: SetLocationStateOptions = {}) => {
      const { activeLSI } = ref.current
      const newStateMap = new Map(Object.entries(activeLSI.getLocationState()))
      newStateMap.delete(itemName)
      activeLSI.setLocationState(Object.fromEntries(newStateMap.entries()), opts)
    },
    [itemName]
  )

  const setLocationStateItem: SetLocationState<T> = useCallback(
    (newValueOrFn, opts = {}) => {
      const {
        activeLSI: { getLocationState, setLocationState },
      } = ref.current
      let newValue: T
      const currentState = getLocationState()
      const currentValue: T =
        itemName in currentState ? (currentState[itemName] as any) : defaultValue

      if (typeof newValueOrFn === 'function') {
        // @ts-ignore
        newValue = newValueOrFn(currentValue)
      } else {
        newValue = newValueOrFn
      }

      if (newValue === defaultValue) {
        return resetLocationStateItem(opts)
      }

      const stateExtendOverwrite: any = {
        [itemName]: newValue,
      }

      setLocationState(
        {
          ...getLocationState(),
          ...stateExtendOverwrite,
        },
        opts
      )
    },
    [defaultValue, itemName, resetLocationStateItem]
  )

  useEffect(() => {
    ref.current = {
      activeLSI,
    }
  })

  return [value, setLocationStateItem]
}
