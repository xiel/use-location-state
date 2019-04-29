import { QueryState } from 'query-state-core'
import { QueryStateOptsSetInterface } from './types'
import { useLocationHashQueryStringInterface } from './useLocationHashQueryStringInterface'
import useQueryState from './useQueryState'
import useQueryStateObj from './useQueryStateObj'

export function useHashQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
) {
  const hashQSI = useLocationHashQueryStringInterface()
  return useQueryStateObj(defaultQueryState, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}

export default function useHashQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
) {
  const hashQSI = useLocationHashQueryStringInterface()
  return useQueryState(itemName, defaultValue, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}
