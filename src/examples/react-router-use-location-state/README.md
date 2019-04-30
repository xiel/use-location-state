# react-router-use-location-state test/demo

- [Demo (codesandbox.io)](https://codesandbox.io/s/github/xiel/location-state/tree/master/src/examples/use-location-state/01-simple)
- [use-location-state (Github)](https://github.com/xiel/location-state/tree/master/src/packages/use-location-state)

````typescript
// option for react-router < 5.0.0 or in case context is not available (anymore)
export function useHistoryQueryState<T>(itemName: string, defaultValue: T, history: H.History) {
  const queryStringInterface = useReactRouterQueryStringInterface(history)
  return useQueryState(itemName, defaultValue, {
    queryStringInterface,
  })
}
````
