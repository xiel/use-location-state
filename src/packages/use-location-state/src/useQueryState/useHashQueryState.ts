import { QueryState } from 'query-state-core'
import { QueryStateOptsSetInterface, QueryStateType } from './useQueryState.types'
import { useHashQueryStringInterface } from './useHashQueryStringInterface'
import { useQueryState } from './useQueryState'
import { useQueryStateObj } from './useQueryStateObj'

export function useHashQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
) {
  const hashQSI = useHashQueryStringInterface()
  return useQueryStateObj(defaultQueryState, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}

export function useHashQueryState<T extends QueryStateType>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
) {
  const hashQSI = useHashQueryStringInterface()
  return useQueryState(itemName, defaultValue, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}
