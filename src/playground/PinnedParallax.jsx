import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PinnedParallax() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 1,
        },
      });

      tl.to(".layer-bg", { scale: 1.6, opacity: 0.4, ease: "none" }, 0)
        .to(".layer-mid", { yPercent: -60, ease: "none" }, 0)
        .to(".layer-title", { yPercent: -120, opacity: 0, ease: "power1.in" }, 0.3)
        .from(".layer-reveal", { yPercent: 100, opacity: 0, ease: "power2.out" }, 0.4)
        .to(".layer-ring", { rotate: 360, scale: 1.8, ease: "none" }, 0);
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-screen overflow-hidden bg-black text-white"
    >
      <div
        className="layer-bg absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #3b0764 0%, #1e1b4b 40%, #000 80%)",
        }}
      />

      <div className="layer-ring absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 pointer-events-none" />
      <div className="layer-ring absolute left-1/2 top-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none" />

      <div className="absolute top-20 left-6 text-xs tracking-[0.4em] text-white/40 z-10">
        POC 3 — PINNED + SCRUBBED PARALLAX
      </div>

      <div className="layer-mid relative h-full flex flex-col items-center justify-center">
        <h2 className="layer-title text-6xl md:text-8xl font-black tracking-tight text-center">
          SCROLL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
            CHOREOGRAPHED
          </span>
        </h2>

        <p className="layer-reveal absolute text-lg md:text-2xl text-white/70 max-w-xl text-center px-6">
          Scroll is pinned. Layers move at different rates.
          <br />
          This is the core of every Apple product page.
        </p>
      </div>

      <div className="absolute bottom-6 right-6 text-xs text-white/40 tracking-widest">
        KEEP SCROLLING ↓
      </div>
    </section>
  );
}
