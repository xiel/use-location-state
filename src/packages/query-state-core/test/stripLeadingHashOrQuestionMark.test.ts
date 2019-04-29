import { stripLeadingHashOrQuestionMark } from '../src/query-state-core'

describe('stripLeadingHashOrQuestionMark', () => {
  it('should strip leading question mark', () => {
    expect(stripLeadingHashOrQuestionMark('?qwe=rtz')).toBe('qwe=rtz')
  })

  it('should strip leading hash tag', () => {
    expect(stripLeadingHashOrQuestionMark('#hash=bang')).toBe('hash=bang')
  })

  it('should not strip leading hash tag in the middle', () => {
    expect(stripLeadingHashOrQuestionMark('hash=b#ng')).toBe('hash=b#ng')
  })

  it('should not strip question mark in the middle', () => {
    expect(stripLeadingHashOrQuestionMark('hash=b?ng')).toBe('hash=b?ng')
  })

  it('should not strip hash tag at the end', () => {
    expect(stripLeadingHashOrQuestionMark('qwe=rtz#')).toBe('qwe=rtz#')
  })

  it('should not strip question mark at the end', () => {
    expect(stripLeadingHashOrQuestionMark('qwe=rtz?')).toBe('qwe=rtz?')
  })

  it('should only strip leading hash tag', () => {
    expect(stripLeadingHashOrQuestionMark('#qwe=rtz#abc?=+')).toBe('qwe=rtz#abc?=+')
  })

  it('should only strip leading question mark', () => {
    expect(stripLeadingHashOrQuestionMark('?qwe=rtz#abc?=+[1,2,3]')).toBe('qwe=rtz#abc?=+[1,2,3]')
  })

  it('should handle empty strings', () => {
    expect(stripLeadingHashOrQuestionMark('')).toBe('')
  })

  it('should handle undefined', () => {
    expect(stripLeadingHashOrQuestionMark(undefined)).toBe('')
  })

  it('should empty strings only containing hash mark', () => {
    expect(stripLeadingHashOrQuestionMark('#')).toBe('')
  })

  it('should empty strings only containing question mark', () => {
    expect(stripLeadingHashOrQuestionMark('?')).toBe('')
  })
})
