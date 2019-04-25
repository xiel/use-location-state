import React from 'react'

interface Props {
  componentsForPathname: Record<string, React.ComponentType>
  defaultComponent?: React.ComponentType
}

export default function usePageComponent({ componentsForPathname, defaultComponent }: Props) {
  let pathname = window.location.pathname || '/'
  let trimmedPathname = ''

  // tolerate (missing) trailing slashes
  if (pathname.slice(-1) === '/') {
    trimmedPathname = pathname.slice(0, -1)
  } else {
    trimmedPathname = pathname
    pathname = pathname + '/'
  }

  return (
    componentsForPathname[pathname] ||
    componentsForPathname[trimmedPathname] ||
    defaultComponent ||
    (() => null)
  )
}
