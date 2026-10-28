export default function Card({ icon, title, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      <header className="card-h">
        <span>{icon}</span>
        <h2>{title}</h2>
        <span className="heart">♡</span>
      </header>
      <div className="card-b">{children}</div>
    </section>
  )
}