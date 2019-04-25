import React, { ChangeEventHandler } from 'react'
import { useLocationHashQueryStateItem } from 'use-location-state'

interface Props {}

const defaultTags: string[] = []

export default function ArrayDemo(props: Props) {
  const [tags, setTags] = useLocationHashQueryStateItem('tags', defaultTags)

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
      <h1>Array Demo</h1>

      <form>
        <label>
          <input
            type="checkbox"
            value="tag-1"
            onChange={toggleTag}
            checked={tags.includes('tag-1')}
          />
          Tag 1
        </label>
        <label>
          <input
            type="checkbox"
            value="tag-2"
            onChange={toggleTag}
            checked={tags.includes('tag-2')}
          />
          Tag 2
        </label>
        <label>
          <input
            type="checkbox"
            value="tag-3"
            onChange={toggleTag}
            checked={tags.includes('tag-3')}
          />
          Tag 3
        </label>
      </form>
    </div>
  )
}
