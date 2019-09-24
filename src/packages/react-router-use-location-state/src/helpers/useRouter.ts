import { useContext } from 'react'
import { __RouterContext as RouterContext } from 'react-router'

if (!RouterContext) throw new Error('missing context export from react-router')

export function useRouter() {
  return useContext(RouterContext)
}
