import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRAME_COUNT } from "../hooks/useFrames";
import { useScramble } from "../hooks/useScramble";
import Hud from "./Hud";

gsap.registerPlugin(ScrollTrigger);

// Ventanas [inicio, fin] de cada frase, en unidades 0–100 del scroll del hero
const WINDOWS = [
  [8, 21],
  [22, 35],
  [36, 50],
  [51, 67],
];

export default function ScrollHero({ images, ready }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const drawRef = useRef(() => {});
  const scramble = useScramble();
  const frame = useRef({ value: 0 });
  const lastDrawn = useRef(-1);

  /* ---- Canvas: dibujo tipo "cover" ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frame.current.value)));
      if (index === lastDrawn.current) return;
      const img = images[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      lastDrawn.current = index;
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastDrawn.current = -1;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [images, ready]);

  /* ---- Línea de tiempo ligada al scroll (cuando todo está cargado) ---- */
  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const q = gsap.utils.selector(root);
    const syncEl = root.querySelector("[data-sync]");
    const frameEl = root.querySelector("[data-frame]");
    const rulerEl = root.querySelector("[data-ruler]");
    let revealed = false;

    const ctx = gsap.context(() => {
      lastDrawn.current = -1;
      drawRef.current();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            const sync = Math.round(Math.min(1, p / 0.9) * 100);
            syncEl.textContent = `${String(sync).padStart(3, "0")}%`;
            frameEl.textContent = `FR ${String(Math.round(frame.current.value) + 1).padStart(3, "0")}/${FRAME_COUNT}`;
            rulerEl.style.transform = `scaleY(${p})`;

            // Descifra el nombre al llegar al final; se rearma al volver atrás
            if (p > 0.76 && !revealed) {
              revealed = true;
              scramble(nameRef.current, "Karla");
              root.classList.add("is-awake");
            } else if (p < 0.68 && revealed) {
              revealed = false;
              root.classList.remove("is-awake");
            }
          },
        },
      });

      tl.to(frame.current, { value: FRAME_COUNT - 1, duration: 90, onUpdate: () => drawRef.current() }, 0);
      tl.fromTo(canvas, { scale: 1.03 }, { scale: 1.12, duration: 100 }, 0);
      tl.to(q(".scroll-hint"), { autoAlpha: 0, duration: 3 }, 1);
      tl.to(q(".beat--intro"), { autoAlpha: 0, y: -50, filter: "blur(10px)", duration: 5, ease: "power2.in" }, 3);

      q("[data-beat]").forEach((el, i) => {
        const [start, end] = WINDOWS[i];
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 40, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 5, ease: "power2.out" },
          start
        ).to(el, { autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 5, ease: "power2.in" }, end - 5);
      });

      tl.fromTo(
        q(".beat--final"),
        { autoAlpha: 0, y: 40, filter: "blur(14px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 10, ease: "power3.out" },
        72
      );
      tl.set({}, {}, 100);
    }, root);

    return () => ctx.revert();
  }, [ready, scramble]);

  return (
    <section className="scrolly" id="historia" ref={rootRef}>
      <div className="scrolly__sticky">
        <canvas
          className="scrolly__canvas"
          ref={canvasRef}
          aria-label="Animación: una IA holográfica gigante despierta sobre la ciudad"
        />

        <div className="fx fx--tint" aria-hidden="true" />
        <div className="fx fx--vignette" aria-hidden="true" />
        <div className="fx fx--scan" aria-hidden="true" />
        <div className="fx fx--grain" aria-hidden="true" />

        <Hud />

        <div className="beat beat--intro">
          <span className="kicker">Noviembre de 2026</span>
          <h1 className="beat__title">El sol<br />esta insoportable.</h1>
        </div>

        <div className="beat beat--left" data-beat>
          <p className="beat__text">Eran solo compañeros.</p>
        </div>
        <div className="beat beat--right" data-beat>
          <p className="beat__text">Él, del mundo de afuera.<br />Ella, de un mundo con otra fe.</p>
        </div>
        <div className="beat beat--left" data-beat>
          <p className="beat__text">Todo estaba prohibido.<br />Hablaron igual, cada noche.</p>
        </div>
        <div className="beat beat--right" data-beat>
          <p className="beat__text">No podían tocarse.<br />Se enamoraron igual.</p>
        </div>

        <div className="beat beat--final">
          <span className="kicker">Un recordatorio para</span>
          <h2 className="beat__hero" data-text="Karla" aria-label="Karla">
            <span ref={nameRef}>Karla</span>
          </h2>
          <p className="beat__since">Cada noche hablamos aún.</p>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span>Desliza</span>
          <i className="scroll-hint__line" />
        </div>
      </div>
    </section>
  );
}
