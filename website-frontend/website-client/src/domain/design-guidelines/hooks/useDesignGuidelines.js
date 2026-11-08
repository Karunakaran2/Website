import { useState } from 'react'

export function useDesignGuidelines() {
  const [activeTopic, setActiveTopic] = useState('principles')
  return { activeTopic, setActiveTopic }
}
