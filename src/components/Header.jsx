import { useElapsed, pad } from "../hooks/useElapsed";

export default function Header() {
  const t = useElapsed();
  return (
    <header className="header">
      <a href="#historia" className="header__brand">Jhonas</a>

      <a href="#juntos" className="header__live" aria-label={`${t.days} días juntos`}>
        <i aria-hidden="true" />
        <span className="header__days">{t.days} d</span>
        <span className="header__clock" aria-hidden="true">
          {pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}
        </span>
      </a>

      <nav className="header__nav" aria-label="Principal">
        <a href="#historia">Historia</a>
        <a href="#capitulos">Capítulos</a>
      </nav>
    </header>
  );
}
