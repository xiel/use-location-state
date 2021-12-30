import { SetStateAction } from '../types/sharedTypes'

export const LOCATION_STATE_KEY = '__useLocationState'

export type LocationStateValue<K = unknown> =
  | string
  | number
  | boolean
  | undefined
  | Date
  | Array<K>

export type LocationState = Record<string, LocationStateValue>

export type GlobalLocationState = {
  [LOCATION_STATE_KEY]: LocationState
  [key: string]: unknown
}

export type LocationStateOpts = {
  locationStateInterface?: LocationStateInterface
}

export interface LocationStateInterface {
  getLocationState: () => LocationState
  setLocationState: (
    newState: LocationState,
    opts: SetLocationStateOptions
  ) => void
}

export interface SetLocationStateOptions {
  method?: 'replace' | 'push'
}

export type SetLocationState<T> = (
  newValue: SetStateAction<T>,
  opts?: SetLocationStateOptions
) => void
