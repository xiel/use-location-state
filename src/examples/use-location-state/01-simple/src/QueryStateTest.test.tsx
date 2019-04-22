import React from 'react'
import { render } from 'react-testing-library'
import QueryStateTest from './QueryStateTest'

it('QueryStateTest renders without crash/loop', () => {
  expect(render(<QueryStateTest />))
})
