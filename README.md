# useQueryState()

[![npm (tag)](https://img.shields.io/npm/v/use-location-state/latest.svg)](https://www.npmjs.com/package/use-location-state)
[![Build Status](https://travis-ci.com/xiel/location-state.svg?branch=master)](https://travis-ci.com/xiel/location-state)
[![Greenkeeper badge](https://badges.greenkeeper.io/xiel/location-state.svg)](https://greenkeeper.io/)
[![codecov badge](https://img.shields.io/codecov/c/github/xiel/location-state/master.svg?color=hotpink)](https://codecov.io/gh/xiel/location-state)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/location-state.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

store and retrieve state into/from the browsers history location using modern hooks

# Installation

```bash
yarn add use-location-state
```
In case you use react-router, please check out the router integration segment.

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
Check out the router integrations to use `location.search` (?itemName=different+value) instead.

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

## Router Integration

We plan to provide easy-to-use integrations for all major routers. (*more routers soon - work in progress*)

At the moment we provide integrations for: 

## react-router

```bash
yarn add react-router-use-location-state
```
```javascript
import { useQueryState } from 'react-router-use-location-state'
```

Your favorite router is missing? Feel free to [suggest a router](https://github.com/xiel/location-state/issues).
