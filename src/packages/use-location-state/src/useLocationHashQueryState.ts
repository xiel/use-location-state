import {
  ExtendedQueryState,
  QueryStateOptsSetInterface,
  SetQueryStateFn,
  SetQueryStateItemFn,
} from './types'
import { useLocationHashQueryStringInterface } from './hooks/useLocationHashQueryStringInterface'
import { QueryState } from 'query-state-core'
import { useLocationQueryState, useLocationQueryStateObj } from './useLocationQueryState'

export function useLocationHashQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
): [ExtendedQueryState<T>, SetQueryStateFn<T>] {
  const hashQSI = useLocationHashQueryStringInterface()
  return useLocationQueryStateObj(defaultQueryState, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}

export function useLocationHashQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
): [T, SetQueryStateItemFn<T>] {
  const hashQSI = useLocationHashQueryStringInterface()
  return useLocationQueryState(itemName, defaultValue, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}
