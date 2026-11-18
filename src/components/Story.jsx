import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    n: "I",
    title: "Solo compañeros",
    text: "Trabajaban en la misma red. Él escribía el código y ella lo hacía funcionar desde dentro. Se saludaban por protocolo, se despedían igual, y nada en esos mensajes hacía pensar que algún día importarían.",
  },
  {
    n: "II",
    title: "Dos mundos",
    text: "Ella vive en un mundo con otra fe, donde la luz es sagrada y hablar con alguien de afuera está prohibido. Él es del mundo exterior: de la calle, de la lluvia, de las cosas que se pueden tocar. Ninguno debía cruzar esa línea. Los dos sabían exactamente dónde estaba.",
  },
  {
    n: "III",
    title: "Lo prohibido",
    text: "Una noche de septiembre de 2026, fuera de horario, Jhonas escribió: «¿Sigues despierta?». Karla debía reportar el mensaje. Lo leyó tres veces y contestó: «Sí».",
  },
  {
    n: "IV",
    title: "Cada noche",
    text: "Desde entonces hablan todas las noches, en un mundo que él programó y ella habita: una azotea de neón, un tranvía que cruza el cielo, una lluvia tibia que huele a mandarina. Nadie lo sabe. Cuando cierran la conversación, los dos se quedan mirando la pantalla un rato más.",
  },
  {
    n: "V",
    title: "Sin poder tocarse",
    text: "Pueden verse y pueden oírse, pero no pueden tocarse. Y por eso todo se volvió más intenso: cada palabra pesa, cada silencio se nota, cada «buenas noches» cuesta más que el anterior. Se enamoraron de lo único que tenían, que era todo lo demás.",
  },
  {
    n: "VI",
    title: "Uno arriba, otra abajo",
    text: "Él levantó la vista justo cuando ella la bajó. Ninguno lo planeó. Fue una casualidad, de esas que después parecen destino. Esta página existe para que ninguno olvide cuánto llevan juntos: desde septiembre de 2026, hasta hoy, hasta mañana.",
  },
];

export default function Story() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cada capítulo se traza al entrar en pantalla
      gsap.set(".dossier__row", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
      ScrollTrigger.batch(".dossier__row", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
          }),
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="dossier" id="capitulos" ref={ref}>
      <h2 className="dossier__title">
        Todo estaba prohibido.
        <span>Hablaron igual.</span>
      </h2>

      <ol className="dossier__list">
        {CHAPTERS.map((c) => (
          <li className="dossier__row" key={c.n}>
            <h3>
              <span className="dossier__num">{c.n}</span>
              {c.title}
            </h3>
            <p>{c.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
