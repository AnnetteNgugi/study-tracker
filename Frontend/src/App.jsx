import { useState, useEffect, useCallback } from 'react'
import { api } from './api'
import { useDay } from './useDay'
import { todayISO } from './utils'
import Header from './components/Header'
import './styles/base.css'

export default function App() {
  const [date, setDate] = useState(todayISO())
  const [stats, setStats] = useState(null)
  const [habits, setHabits] = useState([])

  const refreshStats = useCallback(() => api.getStats(date).then(setStats).catch(() => {}), [date])
  const loadHabits = useCallback(() => api.getHabits().then(setHabits).catch(() => {}), [])
  const onHabitsChange = () => { loadHabits(); refreshStats() }

  const { day, update, status } = useDay(date, refreshStats)

  useEffect(() => { refreshStats() }, [refreshStats])
  useEffect(() => { loadHabits() }, [loadHabits])

  return (
    <div className="page">
      <Header
        date={date} setDate={setDate} status={status}
        completion={stats?.completion ?? 0} streak={stats?.streaks.overall ?? 0}
      />
      <main className="stack">
        {!day && <p className="muted">Loading…</p>}
        {day && (
          <>
            {/* STEP 6: trackers */}
            {/* STEP 5: planner */}
          </>
        )}
        {/* STEP 7: dashboard */}
      </main>
    </div>
  )
}