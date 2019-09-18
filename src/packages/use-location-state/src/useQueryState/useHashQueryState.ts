import { QueryState } from 'query-state-core'
import { QueryStateOptsSetInterface } from './useQueryState.types'
import { useHashQueryStringInterface } from './useHashQueryStringInterface'
import useQueryState from './useQueryState'
import useQueryStateObj from './useQueryStateObj'

export function useHashQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOptsSetInterface = {},
) {
  const hashQSI = useHashQueryStringInterface()
  return useQueryStateObj(defaultQueryState, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}

export default function useHashQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOptsSetInterface = {},
) {
  const hashQSI = useHashQueryStringInterface()
  return useQueryState(itemName, defaultValue, {
    ...queryStateOpts,
    queryStringInterface: hashQSI,
  })
}
