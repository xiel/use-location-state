# useQueryState()
 
[![npm (tag)](https://img.shields.io/npm/v/use-location-state/latest.svg)](https://www.npmjs.com/package/use-location-state)
[![Build Status](https://travis-ci.com/xiel/location-state.svg?branch=master)](https://travis-ci.com/xiel/location-state)
[![Greenkeeper badge](https://badges.greenkeeper.io/xiel/location-state.svg)](https://greenkeeper.io/)
[![codecov badge](https://img.shields.io/codecov/c/github/xiel/location-state/master.svg?color=hotpink)](https://codecov.io/gh/xiel/location-state)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/location-state.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


store and retrieve state into/from the browsers history location using modern hooks

## Usage

The useQueryState hook works similar to the `useState()` hook and returns the current value and a set function in a pair.

````javascript
const [name, setName] = useQueryState('name', 'Sarah')
const [age, setAge] = useQueryState('age', 25)
const [active, setActive] = useQueryState('active', false)
````

One important difference is that you are required to pass a key/parameter name for your state hook.

# Installation

````javascript

````
