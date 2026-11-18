import { useCallback, useRef } from "react";

const GLYPHS = "01ABCDEFGHJKLMNPRSTUVXYZ#%/\<>=+*";

/** Efecto "descifrado": devuelve play(el, texto) que revela letra a letra. */
export function useScramble() {
  const raf = useRef(0);

  return useCallback((el, text, duration = 1400) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const reveal = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out += i < reveal || text[i] === " "
          ? text[i]
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);
}
