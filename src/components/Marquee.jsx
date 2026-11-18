const A = ["Él miró hacia arriba", "Ella miró hacia abajo", "Prohibido tocarse", "Cada noche", "Desde septiembre"];
const B = ["Dos mundos", "Otra fe", "Nadie lo sabe", "Se hablan hasta el amanecer", "Se enamoraron igual"];

function Row({ items, reverse }) {
  // El contenido se duplica para que el bucle sea continuo
  const loop = [...items, ...items];
  return (
    <div className={`marquee__row ${reverse ? "is-reverse" : ""}`}>
      <div className="marquee__track">
        {loop.map((t, i) => (
          <span key={i} className={i % 2 ? "is-solid" : ""}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <Row items={A} />
      <Row items={B} reverse />
    </div>
  );
}
