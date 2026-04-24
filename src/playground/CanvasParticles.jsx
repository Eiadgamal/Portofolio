import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PARTICLE_COUNT = 99;
const IMAGE_BASE = "https://assets.codepen.io/16327/flair-";

export default function CanvasParticles() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const host = rootRef.current;
      const ctx = canvas.getContext("2d");

      const sizeCanvas = () => {
        const rect = host.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };
      sizeCanvas();
      let radius = Math.max(canvas.width, canvas.height);

      const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${IMAGE_BASE}${2 + (i % 21)}.png`;
        return { x: 0, y: 0, scale: 0, rotate: 0, img };
      });

      const draw = () => {
        particles.sort((a, b) => a.scale - b.scale);
        const cw = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);
        particles.forEach((p) => {
          ctx.translate(cw / 2, ch / 2);
          ctx.rotate(p.rotate);
          ctx.drawImage(
            p.img,
            p.x,
            p.y,
            p.img.width * p.scale,
            p.img.height * p.scale
          );
          ctx.resetTransform();
        });
      };

      const tl = gsap
        .timeline({ onUpdate: draw })
        .fromTo(
          particles,
          {
            x: (i) => {
              const angle = (i / particles.length) * Math.PI * 2 - Math.PI / 2;
              return Math.cos(angle * 10) * radius;
            },
            y: (i) => {
              const angle = (i / particles.length) * Math.PI * 2 - Math.PI / 2;
              return Math.sin(angle * 10) * radius;
            },
            scale: 1.1,
            rotate: 0,
          },
          {
            duration: 5,
            ease: "sine",
            x: 0,
            y: 0,
            scale: 0,
            rotate: -3,
            stagger: { each: -0.05, repeat: -1 },
          },
          0
        )
        .seek(99);

      const onResize = () => {
        sizeCanvas();
        radius = Math.max(canvas.width, canvas.height);
        tl.invalidate();
      };
      window.addEventListener("resize", onResize);

      const togglePlay = () => {
        gsap.to(tl, { timeScale: tl.isActive() ? 0 : 1 });
      };
      canvas.addEventListener("pointerup", togglePlay);

      return () => {
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("pointerup", togglePlay);
        tl.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-screen bg-[#0e100f] text-white overflow-hidden"
    >
      <div className="absolute top-20 left-6 text-xs tracking-[0.4em] text-white/40 z-10">
        POC 5 — CANVAS PARTICLES
      </div>
      <div className="absolute top-20 right-6 text-xs text-white/40 text-right z-10">
        GSAP TIMELINE · STAGGER REPEAT
        <br />
        <span className="text-white/30">{PARTICLE_COUNT} sprites · 2D canvas</span>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute left-1/2 bottom-24 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-3xl md:text-5xl font-black tracking-tight">
          CLICK TO{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-500">
            PAUSE
          </span>
        </div>
        <div className="mt-3 text-sm text-white/40">
          Infinite staggered repeat. timeScale toggles play state smoothly.
        </div>
      </div>

      <div className="absolute bottom-6 right-6 text-xs text-white/40 tracking-widest z-10">
        ↓
      </div>
    </section>
  );
}
