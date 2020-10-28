import React from 'react'
import { useQueryReducer } from 'react-router-use-location-state'
import { emptyFilters, filterReducer } from './filterReducer'
import { FilterDisplay } from './FilterDisplay'
import { Filter } from './QueryReducerTypes'

const availableFilters: Filter[] = [
  {
    title: 'clothing',
    subFilters: [
      {
        filterKey: 'shirts',
      },
      {
        filterKey: 'jackets',
      },
      {
        filterKey: 'shorts',
      },
    ],
  },
  {
    title: 'shoes',
    subFilters: [
      {
        filterKey: 'boots',
      },
      {
        filterKey: 'running',
      },
      {
        filterKey: 'slippers',
      },
      {
        filterKey: 'sneakers',
        subFilters: [
          {
            filterKey: 'converse',
          },
          {
            filterKey: 'other',
          },
        ],
      },
    ],
  },
]

export default function QueryReducerDemo() {
  const [activeFilters, filtersDispatch] = useQueryReducer(
    'filters',
    filterReducer,
    emptyFilters
  )

  return (
    <div>
      <h2>useQueryReducer Demo</h2>
      <div style={{ display: 'flex' }}>
        <aside>
          <form>
            {availableFilters.map((filter) => (
              <FilterDisplay
                key={'filterKey' in filter ? filter.filterKey : filter.title}
                activeFilters={activeFilters}
                filtersDispatch={filtersDispatch}
                {...filter}
              />
            ))}
            <hr />
            <button
              type="button"
              onClick={() => filtersDispatch({ type: 'clear' })}
            >
              clear activeFilters
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
