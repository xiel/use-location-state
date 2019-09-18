<h1 style="width: 100%; text-align: center;"> { useLocationState, useQueryState }</h1>

[![npm (tag)](https://img.shields.io/npm/v/use-location-state/latest.svg)](https://www.npmjs.com/package/use-location-state)
[![Build Status](https://travis-ci.com/xiel/use-location-state.svg?branch=master)](https://travis-ci.com/xiel/use-location-state)
[![Greenkeeper badge](https://badges.greenkeeper.io/xiel/use-location-state.svg)](https://greenkeeper.io/)
[![codecov badge](https://img.shields.io/codecov/c/github/xiel/use-location-state/master.svg?color=hotpink)](https://codecov.io/gh/xiel/use-location-state)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/use-location-state.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

store and retrieve state into/from the browsers [location history](https://developer.mozilla.org/en-US/docs/Web/API/History) using modern hooks

## ✨ Features

- makes it easy to provide a nice UX to your users, by restoring part of the app state after navigation actions
- makes it easy to share the application in a customizable state
- __`useLocationState(name, defaultValue)`__
  - restores the latest value after navigation actions (back/forward), by keeping value in `history.state`
  - supported value types: `string | number | boolean | Date | Array | Object`
  - handles complex & nested values - all values that can be serialized are supported
- __`useQueryState(name, defaultValue)`__
  - restores the latest value from URL (`location.href`) and after navigation actions (back/forward)
  - supported value types: `string | number | boolean | Date | string[]`
  - handles stringification and parsing from query string of for supported value types
  - invalid entries from the query string are discarded and the component will receive the defaultValue instead

## Installation

```bash
yarn add use-location-state
```

Using __`react-router`__ or another popular router? For the best experience install one of the [router integrations](#router-integration-optional).

## Usage

`useLocationState()` and `useQueryState()` work similar to the `useState()` [hook](https://reactjs.org/docs/hooks-overview.html#state-hook), as they also return the currentValue and a update function in a tuple.

The *important difference* is that __you must pass a name__ before your __default value__ for your state.

```javascript
const [commentText, setCommentText] = useLocationState('commentText', '')
const [priceMax, setPriceMax] = useQueryState('priceMax', 30)
```

### useLocationState()

`useLocationState()` is perfect, when you want to store state that does not need to be reflected in the URL or in case you need more complex data structures like nested objects.


### useQueryState()

 `useQueryState()` is a great, when you want to store information about the current state of you app in the URL. 

```javascript
const [value, setValue] = useQueryState('itemName', 'default value')
```
The name you pass will be used as a parameter name in the query string, when setting a new value:

```javascript
setValue('different value')
```
After calling the update function `setValue()` with a new value, the state will be saved withing the query string of the browser, so that the new state is reproducable after reloads or history navigation (using forward / back button).

```javascript
http://localhost:3000/#itemName=different+value
```

useQueryState() uses the browsers `location.hash` property by default.
Check out the router integrations to use `location.search` instead.

#### Push

In cases where you want the updated state to be represented as a new entry in the history, you can pass a options object to the set function, with the method property set to `'push'`. 

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
      <button type="button" onClick={() => setActive(!active)}>Toggle</button>
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

### react-router (react-router@^5.0.0)

```bash
yarn add react-router-use-location-state
```
```javascript
import { useLocationState, useQueryState } from 'react-router-use-location-state'
```
Usage works the same as described above, except that the URL will look like this now:
```javascript
http://localhost:3000/?itemName=different+value
```
<a href="https://codesandbox.io/s/github/xiel/use-location-state/tree/master/src/examples/react-router-use-location-state?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx">
  <img width="150" alt="Edit react-router-use-location-state-example" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

### More routers soon - work in progress

Your favorite router is missing? Feel free to [suggest a router](https://github.com/xiel/use-location-state/issues).

## Compatibility

Tested in current versions Chrome, Firefox, Safari, Edge, and IE11. This library relies on new, yet stable ECMAScript features, so you might need to include a [polyfill](https://www.npmjs.com/package/react-app-polyfill#polyfilling-other-language-features) if you want to support older browsers like IE11:

```javascript
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```
