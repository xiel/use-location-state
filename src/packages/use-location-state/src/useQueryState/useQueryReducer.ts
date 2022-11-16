import { QueryStateOpts, SetQueryStringOptions } from './useQueryState.types'
import { useCallback, useMemo, useState } from 'react'
import {
  createMergedQuery,
  parseQueryState,
  parseQueryStateValue,
  toQueryStateValue,
  ValueType,
} from 'query-state-core'
import { useHashQueryStringInterface } from './useHashQueryStringInterface'
import { useRefLatest } from '../hooks/useRefLatest'
import { SetLocationStateOptions } from '../useLocationState/useLocationState.types'
import { Reducer, ReducerAction, ReducerState } from '../types/sharedTypes'

export type QueryDispatch<A> = (
  value: A | null,
  opts?: SetQueryStringOptions
) => void

const queryStateOptsDefaults: QueryStateOpts = Object.freeze({})

export function useQueryReducer<
  R extends Reducer<ReducerState<R>, ReducerAction<R>>
>(
  itemName: string,
  reducer: R,
  initialState: ReducerState<R>,
  queryStateOpts?: QueryStateOpts
): [ReducerState<R>, QueryDispatch<ReducerAction<R>>]

export function useQueryReducer<
  R extends Reducer<ReducerState<R>, ReducerAction<R>>,
  InitialArg
>(
  itemName: string,
  reducer: R,
  initialArg: InitialArg,
  initStateFn: (initialArg: InitialArg) => ReducerState<R>,
  queryStateOpts?: QueryStateOpts
): [ReducerState<R>, QueryDispatch<ReducerAction<R>>]

export function useQueryReducer<
  R extends Reducer<ReducerState<R>, ReducerAction<R>>,
  InitialArg
>(
  itemName: string,
  reducer: R,
  initialStateOrInitialArg: ReducerState<R> | InitialArg,
  initStateFnOrOpts?:
    | QueryStateOpts
    | ((initialArg: InitialArg) => ReducerState<R>),
  queryStateOpts?: QueryStateOpts
): [ReducerState<R>, QueryDispatch<ReducerAction<R>>] {
  const mergedQueryStateOpts = Object.assign(
    {},
    queryStateOptsDefaults,
    queryStateOpts,
    typeof initStateFnOrOpts === 'object' ? initStateFnOrOpts : null
  )
  const { queryStringInterface } = mergedQueryStateOpts
  const hashQSI = useHashQueryStringInterface(
    queryStringInterface ? { disabled: true } : undefined
  )
  const activeQSI = queryStringInterface || hashQSI

  // itemName & defaultValue is not allowed to be changed after init
  const [defaultValue] = useState<ReducerState<R>>(() =>
    initStateFnOrOpts && typeof initStateFnOrOpts === 'function'
      ? initStateFnOrOpts(initialStateOrInitialArg as InitialArg)
      : (initialStateOrInitialArg as ReducerState<R>)
  )

  if (!useIsValidQueryStateValue(defaultValue)) {
    throw new Error('unsupported defaultValue')
  }

  const ref = useRefLatest({
    activeQSI,
    defaultValue,
    mergedQueryStateOpts,
    reducer,
  })

  const resetQueryStateItem = useCallback(
    (opts: SetLocationStateOptions) => {
      const { activeQSI } = ref.current
      const currentState = parseQueryState(activeQSI.getQueryString()) || {}
      const newState = { ...currentState, [itemName]: null }
      activeQSI.setQueryString(createMergedQuery(newState), opts)
      setR((rC) => rC + 1)
    },
    [itemName, ref]
  )

  const [, setR] = useState(0)
  const dispatch: QueryDispatch<ReducerAction<R>> = useCallback(
    (action, opts = {}) => {
      const { activeQSI, defaultValue, mergedQueryStateOpts, reducer } =
        ref.current
      const { stripDefaults = true } = mergedQueryStateOpts
      const currentState = parseQueryState(activeQSI.getQueryString()) || {}
      const currentValue =
        itemName in currentState
          ? parseQueryStateValue(currentState[itemName], defaultValue)
          : defaultValue

      if (action === null) {
        return resetQueryStateItem(opts)
      }

      const newValue = reducer(currentValue ?? defaultValue, action)
      const newQueryStateValue = toQueryStateValue(newValue)

      if (newQueryStateValue === null) {
        console.warn(
          'value of ' +
            JSON.stringify(newValue) +
            ' is not supported. "' +
            itemName +
            '" will reset to default value of:',
          defaultValue
        )
      }

      // when a params are set to the same value as in the defaults
      // we remove them to avoid having two URLs reproducing the same state unless stripDefaults === false
      if (stripDefaults) {
        if (
          Array.isArray(defaultValue) &&
          sameAsJsonString(newValue, defaultValue)
        ) {
          return resetQueryStateItem(opts)
        } else if (newValue === defaultValue) {
          return resetQueryStateItem(opts)
        }
      }

      activeQSI.setQueryString(
        createMergedQuery({
          ...currentState,
          [itemName]: toQueryStateValue(newValue),
        }),
        opts
      )

      // force re-render
      setR((rC) => rC + 1)
    },
    [itemName, ref, resetQueryStateItem]
  )

  const currentState = parseQueryState(activeQSI.getQueryString()) || {}
  const currentValue =
    (itemName in currentState
      ? parseQueryStateValue(currentState[itemName], defaultValue)
      : defaultValue) ?? defaultValue

  return [currentValue, dispatch]
}

function useIsValidQueryStateValue(value: unknown): value is ValueType {
  const defaultQueryStateValue = useMemo(
    () => toQueryStateValue(value),
    [value]
  )
  return defaultQueryStateValue !== null
}

function sameAsJsonString(compareValueA: any, compareValueB: any) {
  return JSON.stringify(compareValueA) === JSON.stringify(compareValueB)
}
