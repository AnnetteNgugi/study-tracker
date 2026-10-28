export const iso = d =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
export const todayISO = () => iso(new Date())
export const shift = (s, n) => {
  const d = new Date(s + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return iso(d)
}
export const dayName = (s, style = 'long') =>
  new Date(s + 'T00:00:00').toLocaleDateString('en-US', { weekday: style })