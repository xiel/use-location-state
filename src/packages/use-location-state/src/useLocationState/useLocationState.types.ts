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

type SetStateAction<S> = S | ((prevState: S) => S)

export type SetLocationState<T> = (
  newValue: SetStateAction<T>,
  opts?: SetLocationStateOptions
) => void
