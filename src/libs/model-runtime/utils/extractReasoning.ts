export const getTextContent = (chunk: any): string | null => {
  if (chunk.textDelta && typeof chunk.textDelta === 'string') {
    return chunk.textDelta
  }

  if (chunk.content && typeof chunk.content === 'string') {
    return chunk.content
  }

  if (chunk.data && typeof chunk.data === 'string') {
    return chunk.data
  }

  if (chunk.type === 'text' && typeof chunk.data === 'string') {
    return chunk.data
  }

  return null
}

export const getPotentialStartIndex = (text: string, searchedText: string): number | null => {
  if (searchedText.length === 0) {
    return null
  }

  const directIndex = text.indexOf(searchedText)
  if (directIndex !== -1) {
    return directIndex
  }

  for (let i = text.length - 1; i >= 0; i--) {
    const suffix = text.substring(i)
    if (searchedText.startsWith(suffix)) {
      return i
    }
  }

  return null
}
