import React, { ChangeEventHandler } from 'react'
import { useQueryState } from 'use-location-state'

const defaultTags: string[] = []

export default function ArrayDemo() {
  const [tags, setTags] = useQueryState('tags', defaultTags)

  const toggleTag: ChangeEventHandler<HTMLInputElement> = e => {
    const tag = e.target.value
    if (tags.includes(e.target.value)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  return (
    <div>
      <h2>Array Demo</h2>
      <form>
        <label>
          <input
            type="checkbox"
            value="tag1"
            onChange={toggleTag}
            checked={tags.includes('tag1')}
          />
          Tag 1
        </label>
        <label>
          <input
            type="checkbox"
            value="tag2"
            onChange={toggleTag}
            checked={tags.includes('tag2')}
          />
          Tag 2
        </label>
        <label>
          <input
            type="checkbox"
            value="tag3"
            onChange={toggleTag}
            checked={tags.includes('tag3')}
          />
          Tag 3
        </label>
      </form>
    </div>
  )
}
