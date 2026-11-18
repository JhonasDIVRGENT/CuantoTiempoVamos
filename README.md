# AFTERRAIN — Karla despierta

Scroll cinematográfico neo-noir (estilo Blade Runner) hecho con **React + Vite**, GSAP ScrollTrigger y Lenis. 150 fotogramas WebP dibujados en un `<canvas>` y sincronizados con el scroll.

## Comandos

```
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # producción en dist/
npm run preview   # probar el build
```

## Estructura

```
src/
  App.jsx                    scroll suave (Lenis) y composición
  styles.css                 paleta, tipografía, HUD, efectos
  hooks/useFrames.js         precarga de los 150 fotogramas
  hooks/useScramble.js       efecto de texto "descifrado"
  components/ScrollHero.jsx  canvas + línea de tiempo del scroll
  components/Hud.jsx         marco y lecturas en vivo
  components/Loader.jsx      pantalla de arranque tipo terminal
  components/Dossier.jsx     sección "expediente"
public/frames/               desktop (1600 px) y mobile (900 px)
_legacy/                     versión anterior en HTML/CSS/JS puro
```

## Qué tocar

- **Velocidad:** `height` de `.scrolly` en `styles.css` (700vh).
- **Cuándo sale cada frase:** `WINDOWS` en `ScrollHero.jsx` (unidades 0–100).
- **Colores:** variables en `:root`.
- **Si cambias el número de fotogramas:** `FRAME_COUNT` en `hooks/useFrames.js`.
