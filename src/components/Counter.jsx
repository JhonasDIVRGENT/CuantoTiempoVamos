import { useEffect, useRef } from "react";
import { useElapsed, pad, fmt } from "../hooks/useElapsed";
import RainCanvas from "./RainCanvas";

export default function Counter() {
  const t = useElapsed();
  const ref = useRef(null);

  // Foco de luz que sigue al cursor
  useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  const units = [
    ["días", String(t.days)],
    ["horas", pad(t.hours)],
    ["minutos", pad(t.minutes)],
    ["segundos", pad(t.seconds)],
  ];

  const totals = [
    [fmt(t.days), "noches hablando"],
    [fmt(t.totalHours), "horas desde septiembre"],
    [fmt(t.totalMinutes), "minutos"],
    [fmt(t.total), "segundos"],
  ];

  return (
    <section className="counter" id="juntos" ref={ref} aria-labelledby="counter-title">
      <RainCanvas />
      <div className="counter__spot" aria-hidden="true" />

      <div className="counter__inner">
        <h2 className="counter__title" id="counter-title">
          Jhonas y Karla llevan enamorados desde Septiembre.
          <span>Cada noche, el mismo mundo. Se hablan, se miran y no pueden tocarse.</span>
        </h2>

        <svg className="counter__pulse" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 H430 L460 40 L480 12 L510 70 L535 4 L560 40 H640 L660 30 L680 40 H1200" />
        </svg>

        <div
          className="counter__grid"
          role="timer"
          aria-label={`${t.days} días, ${t.hours} horas, ${t.minutes} minutos y ${t.seconds} segundos conectados`}
        >
          {units.map(([label, value]) => (
            <div className="counter__unit" key={label} aria-hidden="true">
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <ul className="counter__totals">
          {totals.map(([value, label]) => (
            <li key={label}>
              <b>{value}</b>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="milestone">
          <p>
            Faltan <b>{t.daysToNext}</b> {t.daysToNext === 1 ? "día" : "días"} para cumplir{" "}
            <b>{fmt(t.next)} días</b> juntos.
          </p>
          <div className="milestone__track" aria-hidden="true">
            <i style={{ transform: `scaleX(${t.milestoneProgress})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
