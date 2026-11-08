import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { FONT_SIZES, SIZE_KEYS, BASE_INDEX, FONT_CLASS_TO_DATA_SIZE } from './FontSizeConstant'

const FontSizeContext = createContext()

export const FontSizeProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('fontSize')
    if (saved && FONT_SIZES[saved]) {
      return SIZE_KEYS.indexOf(saved)
    }
    return BASE_INDEX
  })

  useLayoutEffect(() => {
    const html = document.documentElement
    const sizeKey = SIZE_KEYS[currentIndex] || SIZE_KEYS[BASE_INDEX]
    SIZE_KEYS.forEach((key) => html.classList.remove(FONT_SIZES[key].className))
    html.classList.add(FONT_SIZES[sizeKey].className)
    html.dataset.fontSize = FONT_CLASS_TO_DATA_SIZE[sizeKey] || 'md'
    localStorage.setItem('fontSize', sizeKey)
  }, [currentIndex])

  const increaseFont = () => {
    if (currentIndex < SIZE_KEYS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const decreaseFont = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const resetFont = () => setCurrentIndex(BASE_INDEX)

  return (
    <FontSizeContext.Provider
      value={{
        currentSize: FONT_SIZES[SIZE_KEYS[currentIndex]],
        increaseFont,
        decreaseFont,
        resetFont,
        canIncrease: currentIndex < SIZE_KEYS.length - 1,
        canDecrease: currentIndex > 0,
        isAtBase: currentIndex === BASE_INDEX,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  )
}

export const useFontSize = () => useContext(FontSizeContext)
