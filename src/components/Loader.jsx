const LINES = [
  "Conectando con el distrito 07",
  "Descargando memoria visual",
  "Calibrando sensores",
  "Sincronizando",
];

export default function Loader({ progress, done }) {
  const pct = Math.round(progress * 100);
  const step = Math.min(LINES.length - 1, Math.floor(progress * LINES.length));
  return (
    <div className={`loader ${done ? "is-done" : ""}`} role="status" aria-live="polite">
      <div className="loader__inner">
        <span className="loader__brand">Te amo</span>
        <ul className="loader__log">
          {LINES.slice(0, step + 1).map((l, i) => (
            <li key={l} className={i === step && !done ? "is-active" : ""}>{l}</li>
          ))}
        </ul>
        <div className="loader__track"><div className="loader__bar" style={{ transform: `scaleX(${progress})` }} /></div>
        <span className="loader__pct">{String(pct).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
