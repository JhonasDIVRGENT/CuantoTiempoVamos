import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Escena fijada: él mira arriba, ella mira abajo, y se encuentran en la casualidad. */
export default function Casualidad() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.fromTo(".cas__up", { autoAlpha: 0, y: "-22vh" }, { autoAlpha: 1, y: 0, duration: 25, ease: "power2.out" }, 0);
      tl.fromTo(".cas__down", { autoAlpha: 0, y: "22vh" }, { autoAlpha: 1, y: 0, duration: 25, ease: "power2.out" }, 0);
      tl.fromTo(".cas__beam", { scaleY: 0 }, { scaleY: 1, duration: 35 }, 25);
      tl.fromTo(".cas__dot", { scale: 0 }, { scale: 1, duration: 8, stagger: 27, ease: "back.out(3)" }, 25);
      tl.fromTo(
        ".cas__word",
        { autoAlpha: 0, scale: 1.25, filter: "blur(16px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 15, ease: "power3.out" },
        62
      );
      tl.fromTo(".cas__sub", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 10 }, 80);
      tl.set({}, {}, 100);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cas" ref={ref} aria-label="La casualidad">
      <div className="cas__sticky">
        <p className="cas__up">Ella miró hacia abajo.</p>
        <i className="cas__beam" aria-hidden="true">
          <b className="cas__dot cas__dot--top" />
          <b className="cas__dot cas__dot--bottom" />
        </i>
        <h2 className="cas__word">
          La<br />
          casualidad.
        </h2>
        <p className="cas__sub">Septiembre de 2026. Ninguno de los dos lo planeó.</p>
        <p className="cas__down">Él miró hacia arriba.</p>
      </div>
    </section>
  );
}
