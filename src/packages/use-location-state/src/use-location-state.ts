import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMergedQuery, parseQueryState, QueryState } from 'query-state-core'

interface LocationSearchCommon {
  stripDefaults?: boolean
}

interface LocationSearchGetterSetter extends LocationSearchCommon {
  search: string
}

interface LocationSearchGetSetFuncs extends LocationSearchCommon {
  getSearch: () => string
  setSearch: (newSearch: string, setQueryStateOpts: SetQueryStateOpts) => void
}

export type LocationSearch = LocationSearchGetterSetter | LocationSearchGetSetFuncs

export interface SetQueryStateOpts {
  method?: 'push' | 'replace'
}

function getSearch(locationSearch: LocationSearch) {
  if ('getSearch' in locationSearch) {
    return locationSearch.getSearch()
  } else {
    return locationSearch.search
  }
}

function setSearch(
  locationSearch: LocationSearch,
  newSearch: string,
  setQueryStateOpts: SetQueryStateOpts
) {
  if ('setSearch' in locationSearch) {
    locationSearch.setSearch(newSearch, setQueryStateOpts)
  } else {
    locationSearch.search = newSearch
  }
}

function checkLocationSearchArgumentType(
  locationSearch: LocationSearch,
  defaultQueryState: unknown
) {
  if ('search' in locationSearch && Object.getOwnPropertyDescriptor) {
    const searchDesc = Object.getOwnPropertyDescriptor(locationSearch, 'search')
    if (!(searchDesc && searchDesc.get && searchDesc.set)) {
      console.warn(
        'locationSearch argument should provide a getter/setter interface at useLocationQueryParam(s) with defaultValue(s):',
        defaultQueryState
      )
    }
  }
}

export function useLocationQueryParams<T extends QueryState>(
  defaultQueryState: T,
  locationSearch: LocationSearch = window.location
) {
  const queryString = getSearch(locationSearch)
  const [_, setLatestMergedQueryString] = useState<string>()
  const queryState: Partial<T> & QueryState = useMemo(
    () => ({
      ...defaultQueryState,
      ...parseQueryState(queryString),
    }),
    [defaultQueryState, queryString]
  )
  type QST = typeof queryState

  const ref = useRef({
    defaultQueryState,
    locationSearch,
  })

  const setQueryState = useCallback(
    (newState: Partial<T> & QueryState, setQueryStateOpts?: SetQueryStateOpts) => {
      const { defaultQueryState, locationSearch } = ref.current
      const { stripDefaults = true } = locationSearch
      const stripOverwrite: QueryState = {}

      if (process.env.NODE_ENV !== 'production') {
        checkLocationSearchArgumentType(locationSearch, defaultQueryState)
      }

      // when a params are set to the same value as in the defaults
      // we remove them to avoid having two URLs reproducing the same state unless stripDefaults === false
      if (stripDefaults) {
        Object.entries(newState).forEach(([key]) => {
          if (defaultQueryState[key] === newState[key]) {
            stripOverwrite[key] = null
          }
        })
      }

      // retrieve the last value (by re-executing the search getter)
      const currentQueryState: QST = {
        ...defaultQueryState,
        ...parseQueryState(getSearch(locationSearch)),
      }

      const mergedQueryString = createMergedQuery(currentQueryState || {}, newState, stripOverwrite)

      setSearch(locationSearch, mergedQueryString, setQueryStateOpts || {})
      setLatestMergedQueryString(mergedQueryString)
    },
    []
  )

  useEffect(() => {
    ref.current = {
      defaultQueryState,
      locationSearch,
    }
  })

  // TODO: use array as well
  return { queryState, setQueryState }
}

export function useLocationQueryParam<T>(
  paramName: string,
  defaultValue: T,
  locationSearch?: LocationSearch
): [T, (newValue: T, setQueryStateOpts?: SetQueryStateOpts) => void] {
  const defaultQueryState = useMemo(() => ({ [paramName]: defaultValue }), [
    paramName,
    defaultValue,
  ])
  const { queryState, setQueryState } = useLocationQueryParams(defaultQueryState, locationSearch)
  const setParam = useCallback(
    (newValue: T, setQueryStateOpts?: SetQueryStateOpts) =>
      setQueryState({ [paramName]: newValue }, setQueryStateOpts),
    [paramName, setQueryState]
  )

  // fallback to default value
  const paramValue = queryState[paramName]
  const value: T = paramValue === undefined ? defaultValue : paramValue

  return [value, setParam]
}
