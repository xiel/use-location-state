import { createMergedQuery, parseQueryState } from '../src/query-state-core'

describe('parseQueryState parses', () => {
  it('empty string', () => {
    expect(parseQueryState('')).toEqual(null)
  })

  it('question mark string', () => {
    expect(parseQueryState('?')).toEqual(null)
  })

  it('query string with one parameter', () => {
    expect(parseQueryState('?a=abc')).toEqual({ a: 'abc' })
  })

  it('query string with multiple parameters', () => {
    expect(parseQueryState('?a=abc&d=efg')).toEqual({ a: 'abc', d: 'efg' })
  })

  it('query string with multiple parameters with the same name', () => {
    expect(parseQueryState('?a=abc&a=efg')).toEqual({ a: 'efg' })
  })

  it('query string with array value', () => {
    expect(parseQueryState('?filters=[1,2,3]')).toEqual({ filters: [1, 2, 3] })
  })

  it('query string with true boolean parameter', () => {
    expect(parseQueryState('?a=true')).toEqual({ a: true })
  })

  it('query string with two boolean parameters', () => {
    expect(parseQueryState('?b=false&c=true')).toEqual({ c: true, b: false })
  })

  it('query string with parameter value containing spaces', () => {
    expect(parseQueryState('?param=with%20space%20between')).toEqual({
      param: 'with space between',
    })
  })
})

describe('createMergedQuery', () => {
  it('overwrites same keys with later value', () => {
    expect(createMergedQuery({ a: 'b' })).toEqual('?a=b')
  })

  it('overwrites same keys with later value', () => {
    expect(createMergedQuery({ a: 'b' }, { a: 'c' })).toEqual('?a=c')
  })

  it('stable sort keys', () => {
    const abc = '?a=true&b=true&c=true'
    expect(createMergedQuery({ a: true }, { b: true }, { c: true })).toEqual(abc)
    expect(createMergedQuery({ c: true }, { a: true }, { b: true })).toEqual(abc)
    expect(createMergedQuery({ b: true }, { c: true }, { a: true })).toEqual(abc)
    expect(createMergedQuery({ b: true, c: true, a: true })).toEqual(abc)
  })

  it('with boolean values', () => {
    expect(createMergedQuery({ bool: true, bool2: false })).toEqual('?bool=true&bool2=false')
  })

  it('with removed null values', () => {
    expect(createMergedQuery({ nullable: null })).toEqual('')
  })

  it('with removed entries by overwrite with null', () => {
    expect(createMergedQuery({ nullable: true }, { nullable: null })).toEqual('')
  })

  it('with boolean overwriting null', () => {
    expect(createMergedQuery({ nulled: null }, { nulled: false })).toEqual('?nulled=false')
  })

  it('allows empty objects', () => {
    expect(createMergedQuery({}, { a: 'c' }, {})).toEqual('?a=c')
  })

  it('with removed entries by overwrite with undefined', () => {
    expect(
      createMergedQuery(
        { otherwiseEmpty: false, notDefined: true },
        { notDefined: undefined },
        { otherwiseEmpty: true }
      )
    ).toEqual('?otherwiseEmpty=true')
  })
})
