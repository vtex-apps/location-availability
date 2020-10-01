import { useState, useEffect } from 'react'

export const useShowWithDelay = () => {
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setCanShow(true), 300)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return canShow
}
