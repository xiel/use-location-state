export type LocationStateValue<K = unknown> =
  | string
  | number
  | boolean
  | undefined
  | Date
  | Array<K>

export type LocationState = Record<string, LocationStateValue>

export interface LocationStateInterface {
  getLocationState: () => LocationState
  setLocationState: (newState: LocationState, opts: SetLocationStateOptions) => void
}

export interface SetLocationStateOptions {
  method?: 'replace' | 'push'
}

export type SetLocationState<T> = (
  newValue: T | ((value: T) => T),
  opts?: SetLocationStateOptions
) => void
export type ResetLocationState = (opts?: SetLocationStateOptions) => void
