/* =========================================================
   AFTERRAIN — animación de secuencia de imágenes con scroll
   ---------------------------------------------------------
   1. Precarga los 150 fotogramas (versión escritorio o móvil).
   2. Dibuja en un <canvas> el fotograma que corresponde al scroll.
   3. GSAP ScrollTrigger conecta el scroll con el número de fotograma
      y con la aparición de los textos.
   4. Lenis suaviza el scroll.
   ========================================================= */

const FRAME_COUNT = 150;
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const FOLDER = isMobile ? "frames/mobile" : "frames/desktop";

// frame_0001.webp ... frame_0150.webp
const frameSrc = (i) => `${FOLDER}/frame_${String(i + 1).padStart(4, "0")}.webp`;

const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const loaderEl = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderPct = document.getElementById("loader-pct");

const images = new Array(FRAME_COUNT);
const state = { frame: 0 }; // GSAP anima este valor
let lastDrawn = -1;

/* ---------- 1. Precarga ---------- */
function preloadFrames() {
  return new Promise((resolve) => {
    let done = 0;

    const onFinish = () => {
      done++;
      const pct = done / FRAME_COUNT;
      loaderBar.style.transform = `scaleX(${pct})`;
      loaderPct.textContent = `${Math.round(pct * 100)}%`;
      if (done === FRAME_COUNT) resolve();
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = onFinish;
      img.onerror = () => {
        console.warn("No se pudo cargar:", frameSrc(i));
        onFinish();
      };
      img.src = frameSrc(i);
      images[i] = img;
    }
  });
}

/* ---------- 2. Dibujo en el canvas ---------- */
// Ajusta el canvas al tamaño de pantalla (nítido en pantallas retina)
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  lastDrawn = -1; // fuerza redibujado
  render();
}

// Dibuja la imagen tipo "object-fit: cover" (llena la pantalla sin deformar)
function drawCover(img) {
  const cw = canvas.width;
  const ch = canvas.height;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

function render() {
  const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(state.frame)));
  if (index === lastDrawn) return; // no redibujar si no cambió
  const img = images[index];
  if (!img || !img.complete || !img.naturalWidth) return;
  drawCover(img);
  lastDrawn = index;
}

/* ---------- 3. Scroll suave (Lenis) ---------- */
let lenis = null;
function setupLenis() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof Lenis === "undefined") return;

  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- 4. Línea de tiempo ligada al scroll ---------- */
// La línea de tiempo dura 100 "unidades" = 0% a 100% del scroll del hero.
function setupScrollTimeline() {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".scrolly",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6, // pequeño retraso = sensación más suave
    },
  });

  // Fotogramas: avanzan del 0% al 90%; el último 10% deja la imagen final quieta
  tl.to(state, { frame: FRAME_COUNT - 1, duration: 90, onUpdate: render }, 0);

  // Barra de progreso
  tl.fromTo(".progress__bar", { scaleX: 0 }, { scaleX: 1, duration: 100 }, 0);

  // Indicador "Desliza" desaparece al empezar
  tl.to(".scroll-hint", { autoAlpha: 0, duration: 3 }, 1);

  // Texto inicial: visible al cargar, sale pronto
  tl.to(".beat--intro", { autoAlpha: 0, y: -50, filter: "blur(10px)", duration: 5, ease: "power2.in" }, 3);

  // Textos intermedios: [inicio, fin] en unidades de la línea de tiempo
  const windows = [
    [9, 22],  // "En esta ciudad, nadie mira hacia arriba."
    [23, 35], // "Excepto uno."  (mientras la figura aún se ve)
    [44, 62], // "Ella lleva años esperando..." (antes de que abra los ojos)
  ];
  gsap.utils.toArray("[data-beat]").forEach((el, i) => {
    const [start, end] = windows[i];
    tl.fromTo(
      el,
      { autoAlpha: 0, y: 40, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 5, ease: "power2.out" },
      start
    ).to(el, { autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 5, ease: "power2.in" }, end - 5);
  });

  // Título final: aparece cuando ella abre los ojos y se queda
  tl.fromTo(
    ".beat--final",
    { autoAlpha: 0, y: 60, scale: 0.96, filter: "blur(14px)" },
    { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 12, ease: "power3.out" },
    72
  );

  // Asegura que la línea de tiempo dure exactamente 100
  tl.set({}, {}, 100);
}

/* ---------- 5. Aparición de la sección "about" ---------- */
function setupReveals() {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}

/* ---------- Inicio ---------- */
async function init() {
  window.scrollTo(0, 0);
  resizeCanvas();

  await preloadFrames();
  render();

  setupLenis();
  setupScrollTimeline();
  setupReveals();

  // Oculta el loader y habilita el scroll
  loaderEl.classList.add("is-done");
  document.body.classList.remove("is-loading");
  ScrollTrigger.refresh();
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

init();
