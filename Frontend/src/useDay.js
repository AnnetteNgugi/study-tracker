import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from './api'

export function useDay(date, onSaved) {
  const [day, setDay] = useState(null)
  const [status, setStatus] = useState('loading')
  const ref = useRef(null)
  const timer = useRef()
  const dirty = useRef(false)

  useEffect(() => {
    let live = true
    setDay(null)
    setStatus('loading')
    api.getDay(date)
      .then(d => { if (live) { ref.current = d; setDay(d); setStatus('saved') } })
      .catch(() => live && setStatus('error'))
    return () => {
      live = false
      clearTimeout(timer.current)
      if (dirty.current) { api.saveDay(date, ref.current).catch(() => {}); dirty.current = false }
    }
  }, [date])

  const update = useCallback(fn => {
    const next = fn(ref.current)
    ref.current = next
    dirty.current = true
    setDay(next)
    setStatus('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      api.saveDay(date, next)
        .then(() => { dirty.current = false; setStatus('saved'); onSaved?.() })
        .catch(() => setStatus('error'))
    }, 500)
  }, [date, onSaved])

  return { day, update, status }
}