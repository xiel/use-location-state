import React from 'react'
import Header from './components/Header'
import usePageComponent from './hooks/usePageComponent'
// demo pages
import QueryStateDemo from './pages/QueryStateDemo'
import LocationStateDemo from './pages/LocationStateDemo'
import ArrayDemo from './pages/ArrayDemo'

export default function App() {
  const PageComponent = usePageComponent({
    componentsForPathname: {
      '/': QueryStateDemo,
      '/location-state': LocationStateDemo,
      '/array-demo': ArrayDemo,
    },
  })

  return (
    <div className="page-wrapper">
      <Header />
      <PageComponent />
    </div>
  )
}
