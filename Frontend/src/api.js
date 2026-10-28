const j = async (url, opts) => {
  const r = await fetch(url, opts)
  if (!r.ok) throw new Error(r.status)
  return r.status === 204 ? null : r.json()
}
const send = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const api = {
  getDay: d => j(`/api/day/${d}`),
  saveDay: (d, data) => j(`/api/day/${d}`, send('PUT', data)),
  getHabits: () => j('/api/habits'),
  addHabit: name => j('/api/habits', send('POST', { name })),
  delHabit: id => j(`/api/habits/${id}`, { method: 'DELETE' }),
  getStats: d => j(`/api/stats?date=${d}`),
}