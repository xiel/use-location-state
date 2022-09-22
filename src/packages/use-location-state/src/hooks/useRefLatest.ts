import { useEffect, useLayoutEffect, useRef } from 'react'

const isSSR = typeof window === 'undefined' || typeof document === 'undefined'
const useIsoLayoutEffect = isSSR ? useEffect : useLayoutEffect

export function useRefLatest<T>(value: T) {
  const ref = useRef(value)

  useIsoLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
