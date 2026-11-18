import { useEffect, useRef } from "react";

/** Lluvia neón de fondo. Solo anima mientras es visible y respeta "reducir movimiento". */
export default function RainCanvas({ density = 0.00007 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COLORS = ["46,230,214", "255,154,46", "233,228,216"];
    let drops = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -40,
      len: 10 + Math.random() * 28,
      speed: 9 + Math.random() * 14,
      alpha: 0.12 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.round(w * h * density) }, () => spawn(true));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.strokeStyle = `rgba(${d.color},${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.12, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > h + 40) Object.assign(d, spawn(false));
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density]);

  return <canvas className="rain" ref={ref} aria-hidden="true" />;
}
