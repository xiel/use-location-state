import { QueryStateOpts } from './useQueryState.types'

export type Dispatch<A> = (value: A) => void
export type ReducerFn<State, Action> = (state: State, action: Action) => State

export function useQueryReducer<State, Action>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialState: State,
  queryStateOpts?: QueryStateOpts
): [State, Dispatch<Action>]

export function useQueryReducer<State, Action, InitialArg>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialArg: InitialArg,
  initStateFn: (initialArg: InitialArg) => State,
  queryStateOpts?: QueryStateOpts
): [State, Dispatch<Action>]

export function useQueryReducer<State, Action, InitialArg>(
  itemName: string,
  reducer: ReducerFn<State, Action>,
  initialStateOrInitialArg: State | InitialArg,
  initStateFnOrOpts?: QueryStateOpts | ((initialArg: InitialArg) => State),
  queryStateOpts: QueryStateOpts = {}
): [State, Dispatch<Action>] {
  return [] as any
}
