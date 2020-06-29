import { QueryDispatch } from 'react-router-use-location-state'
import { ActionTypes, FilterKeys } from './filterReducer'

export type Filter = FilterLeaf | FilterWithSubFilters

export type FilterDisplayProps = Filter & {
  activeFilters: FilterKeys
  filtersDispatch: QueryDispatch<ActionTypes>
}

export interface FilterWithSubFilters {
  title: string
  subFilters: Filter[]
}

export interface FilterLeaf {
  filterKey: string
}
