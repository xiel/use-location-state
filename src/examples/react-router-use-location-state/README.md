# react-router-use-location-state test/demo

[![Edit react-router-use-location-state-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/xiel/use-location-state/tree/master/src/examples/react-router-use-location-state?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx)

- [use-location-state (Github)](https://github.com/xiel/use-location-state/tree/master/src/packages/use-location-state)

````typescript
// option for react-router < 5.0.0 or in case context is not available (anymore)
export function useHistoryQueryState<T>(itemName: string, defaultValue: T, history: H.History) {
  const queryStringInterface = useReactRouterQueryStringInterface(history)
  return useQueryState(itemName, defaultValue, {
    queryStringInterface,
  })
}
````
