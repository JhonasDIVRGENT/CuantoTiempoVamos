import { useEffect, useState } from "react";

export const FRAME_COUNT = 150;

const src = (folder, i) => `${folder}/frame_${String(i + 1).padStart(4, "0")}.webp`;

/** Precarga los fotogramas; devuelve { images, progress, ready }. */
export function useFrames() {
  const [progress, setProgress] = useState(0);
  const [images] = useState(() => new Array(FRAME_COUNT));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const folder = mobile ? "/frames/mobile" : "/frames/desktop";
    let done = 0;
    let alive = true;

    const finish = () => {
      if (!alive) return;
      done++;
      setProgress(done / FRAME_COUNT);
      if (done === FRAME_COUNT) setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = finish;
      img.onerror = finish;
      img.src = src(folder, i);
      images[i] = img;
    }
    return () => {
      alive = false;
    };
  }, [images]);

  return { images, progress, ready };
}
