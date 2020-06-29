import { FilterKeys } from './filterReducer'
import { Filter, FilterDisplayProps } from './QueryReducerTypes'
import React, { useLayoutEffect, useMemo, useRef } from 'react'

const emptySubFilters: Filter[] = []

function getFilterKeysFlat(filter: Filter): FilterKeys {
  return Object.freeze(
    ([] as FilterKeys).concat(
      'subFilters' in filter
        ? filter.subFilters.flatMap(getFilterKeysFlat)
        : filter.filterKey
    )
  )
}

export function FilterDisplay(props: FilterDisplayProps) {
  const { activeFilters, filtersDispatch } = props
  const label = 'title' in props ? props.title : props.filterKey
  const subFilters = 'subFilters' in props ? props.subFilters : emptySubFilters
  const filterKeysInTree = useMemo(() => getFilterKeysFlat(props), [props])
  const activeFilterKeysInTree = useMemo(
    () => filterKeysInTree.filter((fK) => activeFilters.includes(fK)),
    [activeFilters, filterKeysInTree]
  )
  const checkboxRef = useRef<HTMLInputElement>(null)
  const isActive = !!activeFilterKeysInTree.length
  const isIndeterminateActive =
    isActive && activeFilterKeysInTree.length !== filterKeysInTree.length

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminateActive
    }
  }, [isIndeterminateActive])

  const changeHandler = () => {
    if (isActive) {
      filtersDispatch({
        type: 'remove',
        toRemove: activeFilterKeysInTree,
      })
    } else {
      filtersDispatch({
        type: 'add',
        toAdd: filterKeysInTree,
      })
    }
  }

  return (
    <div style={{ paddingLeft: '1.2em' }}>
      <label style={{ display: 'block', margin: '.25em' }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isActive}
          onChange={changeHandler}
        />
        {label}
      </label>
      {subFilters?.length && isActive ? (
        <ul>
          {subFilters.map((filter) => (
            <FilterDisplay
              key={'filterKey' in filter ? filter.filterKey : filter.title}
              activeFilters={activeFilters}
              filtersDispatch={filtersDispatch}
              {...filter}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
