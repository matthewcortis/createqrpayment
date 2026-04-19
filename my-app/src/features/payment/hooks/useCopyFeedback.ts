import { useEffect, useRef, useState } from 'react'
import { copyToClipboard } from '../utils/clipboard'

const COPY_FEEDBACK_TIMEOUT_MS = 1800

export const useCopyFeedback = () => {
  const [copiedKey, setCopiedKey] = useState('')
  const resetTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    },
    [],
  )

  const copyValue = async (value: string, key: string): Promise<boolean> => {
    const copied = await copyToClipboard(value)

    if (!copied) {
      return false
    }

    setCopiedKey(key)

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopiedKey('')
      resetTimerRef.current = null
    }, COPY_FEEDBACK_TIMEOUT_MS)

    return true
  }

  return {
    copiedKey,
    copyValue,
  }
}
