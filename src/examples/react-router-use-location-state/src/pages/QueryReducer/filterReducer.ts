export type FilterKeys = Readonly<string[]>
export type ActionFilterKeys = string | FilterKeys

export interface ClearAction {
  type: 'clear'
}
export interface AddAction {
  type: 'add'
  toAdd: ActionFilterKeys
}
export interface RemoveAction {
  type: 'remove'
  toRemove: ActionFilterKeys
}
export type ActionTypes = ClearAction | AddAction | RemoveAction

export const emptyFilters: FilterKeys = Object.freeze([])

export function filterReducer(
  filterKeys: FilterKeys,
  action: ActionTypes
): FilterKeys {
  switch (action.type) {
    case 'clear':
      return []
    case 'add':
      return Array.from(
        new Set(filterKeys.concat(action.toAdd).filter((x) => x))
      )
    case 'remove':
      return filterKeys.filter((x) => !action.toRemove.includes(x))
    default:
      // @ts-expect-error
      throw new Error('Unhandled action in filterKeyReducer: ' + action.type)
  }
}
