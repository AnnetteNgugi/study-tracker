import Card from './Card'
import '../styles/planner.css'

const HOURS = Array.from({ length: 17 }, (_, i) => i + 5) // 5:00 → 10:00 pm
const h12 = h => ((h + 11) % 12) + 1
const slot = h => `${h12(h)}:00 - ${h12(h + 1)}:00`
const MOODS = [
  ['Happy', '😊', '#fbeaa5'],
  ['Calm', '😌', '#bfd8ef'],
  ['Tired', '😴', '#d3c8ee'],
  ['Stressed', '😣', '#f9bfca'],
  ['Excited', '🤩', '#c5e8c5'],
]
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner']
const mapAt = (arr, i, fn) => arr.map((x, j) => (j === i ? fn(x) : x))

export default function Planner({ day, update }) {
  const set = (key, value) => update(d => ({ ...d, [key]: value }))
  const setIn = (key, sub, value) => update(d => ({ ...d, [key]: { ...d[key], [sub]: value } }))

  return (
    <div className="cols">
      <div className="col">
        <Card icon="🎯" title="Top 3 Priorities">
          {day.priorities.map((p, i) => (
            <label className="line" key={i}>
              <span className="num">{i + 1}</span>
              <input type="text" value={p}
                onChange={e => set('priorities', mapAt(day.priorities, i, () => e.target.value))} />
            </label>
          ))}
        </Card>

        <Card icon="🕐" title="Time Table">
          <div className="tt-head"><span>Time</span><span>Subject / Task</span></div>
          {HOURS.map(h => (
            <div className="tt-row" key={h}>
              <span className="tt-time">{slot(h)}</span>
              <input type="text" value={day.timetable[h] || ''} onChange={e => setIn('timetable', h, e.target.value)} />
            </div>
          ))}
        </Card>

        <Card icon="🙂" title="Mood Check">
          <div className="moods">
            {MOODS.map(([name, face, color]) => (
              <button key={name} className={`mood ${day.mood === name ? 'sel' : ''}`}
                onClick={() => set('mood', day.mood === name ? '' : name)}>
                <span className="face" style={{ background: color }}>{face}</span>
                {name}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="col">
        <Card icon="✅" title="To Do List">
          {day.todos.map((t, i) => (
            <label className="line" key={i}>
              <input type="checkbox" checked={t.done}
                onChange={e => set('todos', mapAt(day.todos, i, x => ({ ...x, done: e.target.checked })))} />
              <input type="text" value={t.text}
                onChange={e => set('todos', mapAt(day.todos, i, x => ({ ...x, text: e.target.value })))} />
            </label>
          ))}
        </Card>

        <Card icon="💧" title="Water Tracker">
          <div className="jars">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="jar-wrap" key={i}>
                <button className={`jar ${i < day.water ? 'on' : ''}`} aria-label={`${i + 1} glasses`}
                  onClick={() => set('water', day.water === i + 1 ? i : i + 1)}>♥</button>
                <small>{i + 1}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card icon="🍴" title="Meals">
          {MEALS.map(m => (
            <label className="line" key={m}>
              <span className="tag">{m[0].toUpperCase() + m.slice(1)}</span>
              <input type="text" value={day.meals[m] || ''} onChange={e => setIn('meals', m, e.target.value)} />
            </label>
          ))}
        </Card>

        <Card icon="🌸" title="Notes">
          <textarea className="ruled" rows="4" value={day.notes} onChange={e => set('notes', e.target.value)} />
        </Card>

        <Card icon="🌱" title="Gratitude">
          <p className="hint">Today I’m grateful for…</p>
          <textarea className="ruled" rows="3" value={day.gratitude} onChange={e => set('gratitude', e.target.value)} />
        </Card>
      </div>
    </div>
  )
}