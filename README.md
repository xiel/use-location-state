<div style="width: 100%; text-align: center;">
    <h1>{ useLocationState, useQueryState }</h1>
</div>

[![npm (tag)](https://img.shields.io/npm/v/use-location-state/latest.svg)](https://www.npmjs.com/package/use-location-state)
[![codecov badge](https://img.shields.io/codecov/c/github/xiel/use-location-state/master.svg?color=hotpink)](https://codecov.io/gh/xiel/use-location-state)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/use-location-state.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

store and retrieve state into/from the browsers [location history](https://developer.mozilla.org/en-US/docs/Web/API/History) using modern hooks

## ✨ Features

- makes it easy to provide a nice UX to your users, by restoring part of the app state after navigation actions
- makes it easy to share the application in a customizable state
- **`useLocationState(name, defaultValue)`**
  - restores the latest value after navigation actions (back/forward), by keeping value in `history.state`
  - supported value types: `string | number | boolean | Date | Array | Object`
  - handles complex & nested values - all values that can be serialized are supported
- **`useQueryState(name, defaultValue)`**
  - restores the latest value from URL (`location.href`) and after navigation actions (back/forward)
  - supported value types: `string | number | boolean | Date | string[]`
  - handles stringification and parsing from query string of for supported value types
  - invalid entries from the query string are discarded and the component will receive the defaultValue instead

<img style="display: block; margin: auto;" src="https://repository-images.githubusercontent.com/182417896/058a9d00-e2e1-11e9-8467-8923219ec500" />

## Installation

```bash
yarn add use-location-state
```

Using **`react-router`** or another popular router? For the best experience install one of the [router integrations](#router-integration-optional).

## Usage

`useLocationState()` and `useQueryState()` work similar to the `useState()` [hook](https://reactjs.org/docs/hooks-overview.html#state-hook), as they also return the current value and a update function in a tuple `[currentValue, updateValueFn]`.

The _important difference_ is that **you must pass a name** before your **default value** for your state.

```javascript
const [commentText, setCommentText] = useLocationState('commentText', '')
const [priceMax, setPriceMax] = useQueryState('priceMax', 30)
```

### useLocationState()

`useLocationState()` is perfect, when you want to store a state that should not be reflected in the URL or in case of a complex data structure like a nested object/array.

```javascript
const [commentText, setCommentText] = useLocationState('commentText', '')
```

The name you pass, in this case `'commentText'`, will be used as a key when storing the value. So when you use the same name (and default value) in another component, you will get the same state.

```javascript
setCommentText('Wow, this works like a charm!')
```

The updated state will be restored when the pages reloads and after the user navigated to a new page and comes back using a back/forward action.

### useQueryState()

`useQueryState()` is a great, when you want to store information about the current state of you app in the URL.

```javascript
const [value, setValue] = useQueryState('itemName', 'default value')
```

The name you pass will be used as a parameter name in the query string, when setting a new value:

```javascript
setValue('different value')
```

After calling the update function `setValue()` with a new value, the state will be saved withing the query string of the browser, so that the new state is reproducable after reloads or history navigation (using forward / back button) or by loading the same URL anywhere else.

```javascript
http://localhost:3000/#itemName=different+value
```

useQueryState() uses the browsers `location.hash` property by default.
Check out the router integrations to use `location.search` instead.

### Push

In cases where you want the updated state to be represented as a **new entry in the history** you can pass a options object to the set function, with the method property set to `'push'`.

```javascript
setValue('a pushed value', { method: 'push' })
```

This changes the way this state change is handled when the user navigates. When the user now clicks the Back-Button, this state gets popped and the previous state is restored (instead of eg. navigating away).

### Example

```javascript
import { useQueryState } from 'use-location-state'

function MyComponent() {
  const [active, setActive] = useQueryState('active', true)
  return (
    <div>
      <button type="button" onClick={() => setActive(!active)}>
        Toggle
      </button>
      {active && <p>Some active content</p>}
    </div>
  )
}
```

<a href="https://codesandbox.io/embed/zqm4o19yrx">
  <img width="150" alt="Example in CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

### Example with multiple useQueryState hooks in one component

```javascript
import { useQueryState } from 'use-location-state'

function MyComponent() {
  const [name, setName] = useQueryState('name', 'Sarah')
  const [age, setAge] = useQueryState('age', 25)
  const [active, setActive] = useQueryState('active', false)
  // ...
}
```

<a href="https://codesandbox.io/embed/github/xiel/use-location-state/tree/master/src/examples/use-location-state/?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx">
  <img width="150" alt="Example in CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

## Router Integration (optional)

In case you want use [`location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) (after the question mark in the url) you need to use one of these extended versions of the package.

We plan to provide clean and easy-to-use integrations for all popular routers.
At the moment we provide integrations for:

### react-router (react-router@^6.0.0)

```bash
yarn add react-router-use-location-state
```

```javascript
import {
  useLocationState,
  useQueryState,
} from 'react-router-use-location-state'
```

Usage works the same as described above, except that the URL will look like this now:

```javascript
http://localhost:3000/?itemName=different+value
```

<a href="https://codesandbox.io/s/github/xiel/use-location-state/tree/master/src/examples/react-router-use-location-state?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx">
  <img width="150" alt="Edit react-router-use-location-state-example" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

### Gatsby & @reach/router

Gatsby & Reach Router are supported. Gatsby currently always scrolls up on location (state) changes. To keep the scroll position, when you update location state using the update function of `useLocationState`, add these lines to the **gatsby-browser.js** file in gatsby root folder.

```javascript
// keeps same scroll pos when history state is pushed/replaced (same location === same position)
// see: https://www.gatsbyjs.org/docs/browser-apis/#shouldUpdateScroll
exports.shouldUpdateScroll = ({ routerProps, getSavedScrollPosition }) => {
  const currentPosition = getSavedScrollPosition(routerProps.location)
  return currentPosition || true
}
```

### More routers soon - work in progress

Your favorite router is missing? Feel free to [suggest a router](https://github.com/xiel/use-location-state/issues).

## Compatibility

Tested in current versions Chrome, Firefox, Safari, Edge, and IE11. This library relies on new, yet stable ECMAScript features, so you might need to include a [polyfill](https://www.npmjs.com/package/react-app-polyfill#polyfilling-other-language-features) if you want to support older browsers like IE11:

```javascript
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
```
