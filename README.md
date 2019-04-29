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


The useQueryState() works similar to the `useState()` hook and returns the current value and a set function in a pair.

The important difference is that you need to pass a name for your state before your default value.

```javascript
const [value, setValue] = useQueryState('itemName', 'default value')
```
The name you pass will be used in the query string store the state, when the state was changed.

```javascript
setValue('different value')
```
Now the query string in your browser will be update to keep the new state and be able to reproduce it after reloads or history navigation (forward / back button).

```javascript
http://localhost:3000/#itemName=different+value
```

### Example
```javascript
import { useQueryState } from 'use-location-state'

function MyComponent() {
  const [active, setActive] = useQueryState('active', true)
  return (
    <div>
      {active && <p>Some content</p>}
      <button type="button" onClick={() => setActive(!active)} />
    </div>
  )
}
```

## Router Integrations

We plan to easy to use integrations with most popular routers (WIP).
At the moment we provide integrations for:

## react-router

```bash
yarn add react-router-use-query-state
```
