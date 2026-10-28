import Card from './Card'
import { dayName } from '../utils'
import '../styles/dashboard.css'

const STREAKS = [
  ['overall', '🔥', 'Overall'],
  ['study', '📚', 'Study'],
  ['coding', '💻', 'Coding'],
  ['exercise', '🏃', 'Exercise'],
]
const ROWS = [
  ['study', '📚 Study'],
  ['coding', '💻 Coding'],
  ['exercise', '🏃 Exercise'],
]

export default function Dashboard({ stats }) {
  if (!stats) return <p className="muted">Loading…</p>
  const { week, streaks, goals } = stats

  return (
    <div className="dash">
      <div className="streaks">
        {STREAKS.map(([k, icon, label]) => (
          <div className="streak" key={k}>
            <span className="big">{icon} {streaks[k]}</span>
            <small>{label} streak (days)</small>
          </div>
        ))}
      </div>

      <div className="cols">
        <Card icon="📊" title="Weekly Completion">
          <div className="ring-row">
            <div className="ring" style={{ '--p': stats.completion }}><span>{stats.completion}%</span></div>
            <div><b>Selected day</b><br /><small>Week average: {stats.week_avg}%</small></div>
          </div>
          <div className="bars">
            {week.map(w => (
              <div className="bar-col" key={w.date}>
                <span>{w.completion}%</span>
                <div className="bar-v"><i style={{ height: `${w.completion}%` }} /></div>
                <small>{dayName(w.date, 'short')}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card icon="⏱️" title="Minutes This Week">
          <div className="scroll">
            <table>
              <thead>
                <tr><th></th>{week.map(w => <th key={w.date}>{dayName(w.date, 'short')}</th>)}<th>Total</th></tr>
              </thead>
              <tbody>
                {ROWS.map(([k, label]) => (
                  <tr key={k}>
                    <td>{label}</td>
                    {week.map(w => <td key={w.date} className={w[k] >= goals[k] ? 'hit' : ''}>{w[k]}</td>)}
                    <td><b>{week.reduce((s, w) => s + w[k], 0)}</b></td>
                  </tr>
                ))}
                <tr>
                  <td>💧 Water</td>
                  {week.map(w => <td key={w.date}>{w.water}</td>)}
                  <td><b>{week.reduce((s, w) => s + w.water, 0)}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
          <small>Highlighted = daily goal hit.</small>
        </Card>
      </div>

      <Card icon="🌟" title="Habit Streaks">
        <div className="habit-grid">
          {streaks.habits.map(h => (
            <div className="habit-stat" key={h.id}>
              <span>{h.name}</span>
              <span>🔥 {h.streak} · {h.week}/7 this week</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}