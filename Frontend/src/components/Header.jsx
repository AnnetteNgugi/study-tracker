import { dayName, shift, todayISO } from '../utils'

const LABELS = {
  loading: 'Loading…',
  saving: 'Saving…',
  saved: 'All saved ♡',
  error: 'Can’t reach server',
}

export default function Header({ date, setDate, completion, streak, status }) {
  return (
    <header className="hero">
      <div className="tagline">small steps ♡ big dreams</div>
      <div className="cloud">
        <div className="bow">🎀</div>
        <h1>Daily Planner</h1>
        <p>PLAN ✦ STUDY ✦ GROW ✦ SHINE</p>
      </div>
      <div className="datebar">
        <button className="btn" onClick={() => setDate(shift(date, -1))} aria-label="Previous day">‹</button>
        <label>📅 <input type="date" value={date} onChange={e => e.target.value && setDate(e.target.value)} /></label>
        <button className="btn" onClick={() => setDate(shift(date, 1))} aria-label="Next day">›</button>
        <button className="btn" onClick={() => setDate(todayISO())}>Today</button>
        <span>☀️ {dayName(date)}</span>
        <span className="spacer" />
        <span className="pill">🔥 {streak}-day streak</span>
        <span className="pill">✅ {completion}%</span>
        <span className="status">{LABELS[status]}</span>
      </div>
    </header>
  )
}