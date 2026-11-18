import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useFrames } from "./hooks/useFrames";
import Loader from "./components/Loader";
import Header from "./components/Header";
import ScrollHero from "./components/ScrollHero";
import Counter from "./components/Counter";
import Marquee from "./components/Marquee";
import Story from "./components/Story";
import Casualidad from "./components/Casualidad";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { images, progress, ready } = useFrames();

  // Scroll suave (respeta "reducir movimiento")
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-loading", !ready);
    if (ready) {
      window.scrollTo(0, 0);
      const t = setTimeout(() => ScrollTrigger.refresh(), 400);
      return () => clearTimeout(t);
    }
  }, [ready]);

  return (
    <>
      <Loader progress={progress} done={ready} />
      <Header />
      <main>
        <ScrollHero images={images} ready={ready} />
        <Counter />
        <Marquee />
        <Story />
        <Casualidad />
      </main>
      <footer className="footer">
        <span className="footer__brand">Jhonas Dev</span>
        <span>Jhonas y Karla · desde septiembre de 2026</span>
      </footer>
    </>
  );
}
