import React from 'react'
import Header from './components/Header'
import usePageComponent from './hooks/usePageComponent'
// demo pages
import QueryStateTest from './pages/QueryStateTest'
import ArrayDemo from './pages/ArrayDemo'

export default function App() {
  const PageComponent = usePageComponent({
    componentsForPathname: {
      '/': QueryStateTest,
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
