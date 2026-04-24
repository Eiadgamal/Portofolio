import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

export default function CairokeeStateOfMind() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.8,
        },
      });

      tl.to(".som-photo", { scale: 1.2, ease: "none" }, 0)
        .fromTo(
          ".som-big",
          { xPercent: 90 },
          { xPercent: -120, ease: "none" },
          0
        )
        .fromTo(
          ".som-its",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 },
          0.1
        )
        .fromTo(
          ".som-ofmind",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 },
          0.25
        )
        .to(".som-photo-overlay", { opacity: 0.5, ease: "none" }, 0);
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="ck-root relative h-screen overflow-hidden bg-black"
    >
      <img
        src={`${BASE}playground/cairokee/band-photo.jpg`}
        alt=""
        className="som-photo ck-bw absolute inset-0 w-full h-full object-cover will-change-transform"
        draggable={false}
      />
      <div
        className="som-photo-overlay absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0.2 }}
      />

      <div className="absolute top-6 left-6 ck-chapter text-white/70 z-10">
        CHAPTER 02 / LOOK & FEEL
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="som-big ck-display ck-outline-thick"
          style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: "38vw",
            whiteSpace: "nowrap",
          }}
        >
          STATE
        </div>
      </div>

      <div className="som-its absolute top-[30%] left-1/2 -translate-x-[18vw] ck-display text-white text-sm md:text-lg z-10">
        IT'S OUR
      </div>

      <div className="som-ofmind absolute bottom-[28%] left-1/2 translate-x-[14vw] ck-display text-white text-sm md:text-lg z-10">
        OF MIND
      </div>

      <img
        src={`${BASE}playground/cairokee/wordmark-white.png`}
        alt="CAIROKEE"
        className="absolute bottom-8 left-8 w-32 md:w-40 z-10 select-none"
        draggable={false}
        style={{ padding: "12px" }}
      />

      <div className="absolute bottom-8 right-8 ck-chapter text-white/60 z-10 text-right">
        KEEP SCROLLING ↓
      </div>
    </section>
  );
}
