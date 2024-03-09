import React, { useEffect, useState } from 'react'

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState('')

  useEffect(() => {
    const timeRef = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timeRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return debouncedValue
}

export default useDebounce
