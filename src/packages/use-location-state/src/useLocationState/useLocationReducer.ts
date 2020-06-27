import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useLocationStateInterface from './useLocationStateInterface'
import { LocationStateOpts, SetLocationStateOptions } from './useLocationState.types'

const validTypes = ['string', 'number', 'boolean', 'object', 'undefined']
const locationStateOptsDefaults: LocationStateOpts = Object.freeze({})

export type Dispatch<A> = (value: A, opts?: SetLocationStateOptions) => void
export type ReducerFn<State, Action> = (state: State, action: Action) => State

export function useLocationReducer<State, Action>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialState: State,
  opts?: LocationStateOpts
): [State, Dispatch<Action>]

export function useLocationReducer<State, Action, InitialArg>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialArg: InitialArg,
  initStateFn: (initialArg: InitialArg) => State,
  opts?: LocationStateOpts
): [State, Dispatch<Action>]

export function useLocationReducer<State, Action, InitialArg>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialStateOrInitialArg: State | InitialArg,
  maybeInitStateFnOrOpts?: LocationStateOpts | ((initialArg: InitialArg) => State),
  opts?: LocationStateOpts
): [State, Dispatch<Action>] {
  const { locationStateInterface } =
    opts ||
    (typeof maybeInitStateFnOrOpts === 'object' && maybeInitStateFnOrOpts) ||
    locationStateOptsDefaults

  // itemName & defaultValue is not allowed to be changed after init
  const [defaultValue] = useState<State>(() => {
    return maybeInitStateFnOrOpts && typeof maybeInitStateFnOrOpts === 'function'
      ? maybeInitStateFnOrOpts(initialStateOrInitialArg as InitialArg)
      : (initialStateOrInitialArg as State)
  })

  // throw for invalid values like functions
  if (!validTypes.includes(typeof defaultValue)) {
    throw new Error('unsupported defaultValue')
  }

  // item name gets a generated suffix based on defaultValue type, to make accidental clashes less likely
  ;[itemName] = useState(() => {
    const suffixObscurer = typeof btoa !== 'undefined' ? btoa : (s: string) => s
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
  }, [currentState, defaultValue, itemName]) as State

  const resetLocationStateItem = useCallback(
    (opts: SetLocationStateOptions) => {
      const { activeLSI } = ref.current
      const newState = { ...activeLSI.getLocationState() }
      delete newState[itemName]
      activeLSI.setLocationState(newState, opts)
    },
    [itemName]
  )

  const dispatchAction: Dispatch<Action> = useCallback(
    (action, opts = {}) => {
      const {
        activeLSI: { getLocationState, setLocationState },
      } = ref.current
      const currentState = getLocationState()
      const currentValue: State =
        itemName in currentState ? (currentState[itemName] as any) : defaultValue
      const newValue: State = reducer(currentValue, action)

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
          ...currentState,
          ...stateExtendOverwrite,
        },
        opts
      )
    },
    [defaultValue, itemName, reducer, resetLocationStateItem]
  )

  useEffect(() => {
    ref.current = {
      activeLSI,
    }
  })

  return [value, dispatchAction]
}
