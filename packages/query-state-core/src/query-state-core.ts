type QueryState = Record<string, unknown>

function tryJsonParseParamValue(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch (e) {}
  return value
}

export function parseQueryState(queryString: string): QueryState | null {
  const queryState: QueryState = {}
  const params = new URLSearchParams(queryString)
  params.forEach((value, key) => (queryState[key] = tryJsonParseParamValue(value)))
  return Object.keys(queryState).length ? queryState : null
}

export function createMergedQuery(...queryStates: QueryState[]) {
  const mergedQueryStates: QueryState = Object.assign({}, ...queryStates)
  const params = new URLSearchParams()
  Object.entries(mergedQueryStates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }
    if (typeof value === 'string') {
      params.append(key, value)
    } else {
      params.append(key, JSON.stringify(value))
    }
  })
  params.sort()
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}


