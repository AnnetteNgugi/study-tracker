import { useState, useEffect, useCallback } from 'react'
import { api } from './api'
import { useDay } from './useDay'
import { todayISO } from './utils'
import Header from './components/Header'
import Planner from './components/Planner'
import Trackers from './components/Trackers'
import Dashboard from './components/Dashboard'
import './styles/base.css'
import './styles/dashboard.css'

export default function App() {
  const [date, setDate] = useState(todayISO())
  const [tab, setTab] = useState('today')
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

      <nav className="tabs">
        <button className={`btn ${tab === 'today' ? 'on' : ''}`} onClick={() => setTab('today')}>📝 Today</button>
        <button className={`btn ${tab === 'week' ? 'on' : ''}`} onClick={() => setTab('week')}>📊 Week</button>
      </nav>

      {tab === 'today' && (
        <main className="stack">
          {!day && <p className="muted">Loading…</p>}
          {day && (
            <>
              <Trackers day={day} update={update} habits={habits}
                streaks={stats?.streaks} onHabitsChange={onHabitsChange} />
              <Planner day={day} update={update} />
            </>
          )}
        </main>
      )}

      {tab === 'week' && <Dashboard stats={stats} />}

      <p className="muted">♡ Better days are coming ♡</p>
    </div>
  )
}