type LocationState = Record<string, string>

export interface LocationStateInterface {
  getLocationState: () => LocationState
  setLocationState: (newState: LocationState, opts: SetLocationStateOptions) => void
}

export interface SetLocationStateOptions {
  method?: 'replace' | 'push'
}
