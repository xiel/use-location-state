# useQueryState()

[![npm (tag)](https://img.shields.io/npm/v/use-location-state/latest.svg)](https://www.npmjs.com/package/use-location-state)
[![Build Status](https://travis-ci.com/xiel/location-state.svg?branch=master)](https://travis-ci.com/xiel/location-state)
[![Greenkeeper badge](https://badges.greenkeeper.io/xiel/location-state.svg)](https://greenkeeper.io/)
[![codecov badge](https://img.shields.io/codecov/c/github/xiel/location-state/master.svg?color=hotpink)](https://codecov.io/gh/xiel/location-state)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/location-state.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

store and retrieve state into/from the browsers location state using modern hooks

## ✨ Features

- makes it easy to provide a nice UX to your users, by restoring part of the app state after navigation actions
- makes it easy to share application in current state
- supported value types: `string | number | boolean | string[]`
- handles stringification and parsing from query string of for supported value types
- invalid entries from the query string are discarded and the component will receive the defaultValue instead

## Installation

```bash
yarn add use-location-state
```

## Usage

The useQueryState() works similar to the `useState()` [hook](https://reactjs.org/docs/hooks-overview.html#state-hook) and returns the current value and a set function in a pair.

The *important difference* is that you need to pass a __name__ before your __default value__ for your state.

```javascript
const [value, setValue] = useQueryState('itemName', 'default value')
```
The name you pass will be used in the query string store the state (after the state was changed).

```javascript
setValue('different value')
```
After calling the set function with a new value, the state will be saved withing the query string of the browser, so that the new state is reproducable after reloads or history navigation (using forward / back button).

```javascript
http://localhost:3000/#itemName=different+value
```

useQueryState() uses the browsers `location.hash` property by default.
Check out the router integrations to use `location.search` instead.

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
<a href="https://codesandbox.io/embed/github/xiel/location-state/tree/master/src/examples/use-location-state/01-simple?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx">
  <img width="150" alt="Example in CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

## Router Integration (optional)

In case you want use [`location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) (after the question mark in the url) you need to use one of these extended versions of the package.

We plan to provide clean and easy-to-use integrations for all popular routers. 
At the moment we provide integrations for:

### react-router

```bash
yarn add react-router-use-location-state
```
```javascript
import { useQueryState } from 'react-router-use-location-state'
```
Usage works the same as described above, except that the URL will look like this now:
```javascript
http://localhost:3000/?itemName=different+value
```
<a href="https://codesandbox.io/s/github/xiel/location-state/tree/master/src/examples/react-router-use-location-state?fontsize=14&module=%2Fsrc%2Fpages%2FQueryStateDemo.tsx">
  <img width="150" alt="Edit react-router-use-location-state-example" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

### More routers soon - work in progress

Your favorite router is missing? Feel free to [suggest a router](https://github.com/xiel/location-state/issues).
