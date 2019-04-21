import hello from '../src/query-state-core'

describe('hello', () => {
  it('should say hello to me', () => {
    expect(hello("Felix")).toBe('Hello Felix')
  })
})
