// Since action _can_ be undefined, dispatch may be called without any parameters.
// export type DispatchWithoutAction = () => void
// Unlike redux, the actions _can_ be anything
export type Reducer<S, A> = (prevState: S, action: A) => S
// If useReducer accepts a reducer without action, dispatch may be called without any parameters.
export type ReducerWithoutAction<S> = (prevState: S) => S
// types used to try and prevent the compiler from reducing S
// to a supertype common with the second argument to useReducer()
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<
  infer S,
  any
>
  ? S
  : never
export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
  any,
  infer A
>
  ? A
  : never

export type LazyValueFn<S> = () => S
export type SetStateAction<S> = S | ((prevState: S) => S)
