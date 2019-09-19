import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useLocationStateInterface from './useLocationStateInterface'
import { LocationStateOpts, SetLocationState, SetLocationStateOptions } from './useLocationState.types'

const validTypes = ['string', 'number', 'boolean', 'object', 'undefined']
const locationStateOptsDefaults = Object.freeze({})

export default function useLocationState<S>(
  itemName: string,
  defaultValue: S | (() => S),
  { locationStateInterface }: LocationStateOpts = locationStateOptsDefaults
): [S, SetLocationState<S>] {
  // itemName & defaultValue is not allowed to be changed after init
  ;[defaultValue] = useState(defaultValue)
  // throw for invalid values like functions
  if (!validTypes.includes(typeof defaultValue)) {
    throw new Error('unsupported defaultValue')
  }

  // item name gets a generated suffix based on defaultValue type, to make accidental clashes less likely
  ;[itemName] = useState(() => {
    const suffixObscurer = btoa || ((s: string) => s)
    const suffix = suffixObscurer(
      Array.isArray(defaultValue) ? 'array' : typeof defaultValue
    ).replace(/=/g, '')
    return `${itemName}__${suffix}`
  })

  // the interface to get/set the state
  const standardLSI = useLocationStateInterface(locationStateInterface && { disabled: true })
  const activeLSI = locationStateInterface || standardLSI
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
  }, [currentState, defaultValue, itemName]) as S

  const resetLocationStateItem = useCallback(
    (opts: SetLocationStateOptions) => {
      const { activeLSI } = ref.current
      const newState = { ...activeLSI.getLocationState() }
      delete newState[itemName]
      activeLSI.setLocationState(newState, opts)
    },
    [itemName]
  )

  const setLocationStateItem: SetLocationState<S> = useCallback(
    (newValueOrFn, opts = {}) => {
      const {
        activeLSI: { getLocationState, setLocationState },
      } = ref.current
      let newValue: S
      const currentState = getLocationState()
      const currentValue: S =
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

      // warn about invalid new values
      if (!validTypes.includes(typeof newValue)) {
        console.warn(newValue, 'value is not supported, reset to default')
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
