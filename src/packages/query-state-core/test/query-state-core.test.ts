import { createMergedQuery, EMPTY_ARRAY_STRING, parseQueryState } from '../src/query-state-core'

describe('parseQueryState parses', () => {
  it('empty string', () => {
    expect(parseQueryState('')).toEqual(null)
  })

  it('question mark string', () => {
    expect(parseQueryState('?')).toEqual(null)
  })

  it('query string with one parameter', () => {
    expect(parseQueryState('a=abc')).toEqual({ a: 'abc' })
  })

  it('query string with multiple parameters', () => {
    expect(parseQueryState('a=abc&d=efg')).toEqual({ a: 'abc', d: 'efg' })
  })

  it('query string with multiple parameters with the same name as array', () => {
    expect(parseQueryState('a=abc&a=efg')).toEqual({ a: ['abc', 'efg'] })
  })

  it('creates array from query string with multiple value values for same key', () => {
    expect(parseQueryState('filters=1&filters=2&filters=3')).toEqual({ filters: ['1', '2', '3'] })
  })

  it('query string with "true" boolean parameter', () => {
    expect(parseQueryState('a=true')).toEqual({ a: 'true' })
  })

  it('query string with two boolean parameters', () => {
    expect(parseQueryState('b=false&c=true')).toEqual({ c: 'true', b: 'false' })
  })

  it('query string with parameter value containing spaces', () => {
    expect(parseQueryState('param=with%20space%20between')).toEqual({
      param: 'with space between',
    })
  })


  it('query string with invalid keys should be ignored', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
    expect(parseQueryState('toString=true&valid=value&__proto__=true')).toEqual({ valid: 'value' })
    expect(warnSpy).toHaveBeenCalledTimes(2)
    warnSpy.mockRestore()
  })
})

describe('createMergedQuery', () => {
  it('overwrites same keys with later value', () => {
    expect(createMergedQuery({ a: 'b' })).toEqual('a=b')
  })

  it('overwrites same keys with later value', () => {
    expect(createMergedQuery({ a: 'b' }, { a: 'c' })).toEqual('a=c')
  })

  it('stable sort keys', () => {
    const abcQueryString = 'a=true&b=true&c=true'
    expect(createMergedQuery({ a: 'true' }, { b: 'true' }, { c: 'true' })).toEqual(abcQueryString)
    expect(createMergedQuery({ c: 'true' }, { a: 'true' }, { b: 'true' })).toEqual(abcQueryString)
    expect(createMergedQuery({ b: 'true' }, { c: 'true' }, { a: 'true' })).toEqual(abcQueryString)
    expect(createMergedQuery({ b: 'true', c: 'true', a: 'true' })).toEqual(abcQueryString)
  })

  it('with boolean values', () => {
    expect(createMergedQuery({ bool: 'true', bool2: 'false' })).toEqual('bool=true&bool2=false')
  })

  it('with removed null values', () => {
    expect(createMergedQuery({ nullable: null })).toEqual('')
  })

  it('with removed undefined values', () => {
    expect(createMergedQuery({ undef: undefined })).toEqual('')
  })

  it('with removed entries by overwrite with null', () => {
    expect(createMergedQuery({ nullable: 'true' }, { nullable: null })).toEqual('')
  })

  it('with boolean overwriting null', () => {
    expect(createMergedQuery({ nulled: null }, { nulled: 'false' })).toEqual('nulled=false')
  })

  it('allows empty objects', () => {
    expect(createMergedQuery({}, { a: 'c' }, {})).toEqual('a=c')
  })

  it('with removed entries by overwrite with undefined', () => {
    expect(
      createMergedQuery(
        { otherwiseEmpty: 'false', notDefined: 'true' },
        { notDefined: undefined },
        { otherwiseEmpty: 'true' },
      ),
    ).toEqual('otherwiseEmpty=true')
  })


  it('with array value', () => {
    expect(createMergedQuery({ arr: ['1', '2', '3'] })).toEqual('arr=1&arr=2&arr=3')
  })

  it('with array value overwrite (no automatic concat)', () => {
    expect(createMergedQuery({ arr: ['1'] }, { arr: ['a', 'b'] })).toEqual('arr=a&arr=b')
  })

  it('with array with empty', () => {
    expect(createMergedQuery({ arr: [''] })).toEqual('arr=')
  })

  it('with empty array', () => {
    expect(createMergedQuery({ arr: [] })).toEqual('arr=' + encodeURIComponent(EMPTY_ARRAY_STRING))
  })

})
