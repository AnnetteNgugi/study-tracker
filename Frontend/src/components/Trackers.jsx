import { useState } from 'react'
import Card from './Card'
import { api } from '../api'
import '../styles/trackers.css'

const GOALS = { study: 60, coding: 60, exercise: 30 } // keep in sync with backend/stats.py
const ITEMS = [
  ['study', '📚', 'Study'],
  ['coding', '💻', 'Coding'],
  ['exercise', '🏃', 'Exercise'],
]

export default function Trackers({ day, update, habits, streaks, onHabitsChange }) {
  const [name, setName] = useState('')

  const setMinutes = (k, n) =>
    update(d => ({ ...d, tracks: { ...d.tracks, [k]: Math.max(0, n) } }))
  const toggle = id =>
    update(d => ({ ...d, habits: { ...d.habits, [id]: !d.habits[id] } }))
  const add = () => {
    if (!name.trim()) return
    api.addHabit(name.trim()).then(() => { setName(''); onHabitsChange() })
  }
  const habitStreak = id => streaks?.habits.find(h => h.id === id)?.streak ?? 0

  return (
    <Card icon="🏆" title="Daily Tracker">
      <div className="trk">
        {ITEMS.map(([k, icon, label]) => {
          const v = day.tracks[k] || 0
          return (
            <div className="trk-item" key={k}>
              <div className="trk-top">
                <b>{icon} {label}</b>
                <span>🔥 {streaks?.[k] ?? 0}</span>
              </div>
              <div className="bar"><i style={{ width: `${Math.min(100, (v / GOALS[k]) * 100)}%` }} /></div>
              <div className="trk-ctl">
                <button className="btn" onClick={() => setMinutes(k, v - 15)}>−15</button>
                <input type="number" min="0" value={v} onChange={e => setMinutes(k, +e.target.value || 0)} />
                <button className="btn" onClick={() => setMinutes(k, v + 15)}>+15</button>
              </div>
              <small>of {GOALS[k]} min goal</small>
            </div>
          )
        })}
      </div>

      <h3 className="sub">Habits</h3>
      <div className="habits">
        {habits.map(h => (
          <div className="habit" key={h.id}>
            <label>
              <input type="checkbox" checked={!!day.habits[h.id]} onChange={() => toggle(h.id)} />
              {h.name}
            </label>
            <span>🔥 {habitStreak(h.id)}</span>
            <button className="x" aria-label={`Delete ${h.name}`}
              onClick={() => api.delHabit(h.id).then(onHabitsChange)}>×</button>
          </div>
        ))}
      </div>
      <div className="add-habit">
        <input type="text" placeholder="New habit…" value={name}
          onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn" onClick={add}>Add</button>
      </div>
    </Card>
  )
}