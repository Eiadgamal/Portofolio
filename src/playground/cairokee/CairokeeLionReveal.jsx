import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

export default function CairokeeLionReveal() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo(
        ".lion-mark",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
        0
      )
        .fromTo(
          ".lion-word-this",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.1
        )
        .fromTo(
          ".lion-word-is",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.18
        )
        .fromTo(
          ".lion-word-our",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.26
        )
        .fromTo(
          ".lion-word-mark",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.34
        )
        .fromTo(
          ".lion-protection",
          { opacity: 0, scale: 1.1 },
          { opacity: 0.5, scale: 1, duration: 0.25, ease: "power2.out" },
          0.45
        )
        .to(
          ".lion-protection",
          { opacity: 0, duration: 0.25, ease: "power2.in" },
          0.75
        )
        .fromTo(
          ".lion-caption",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.7
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="ck-root relative h-screen overflow-hidden"
      style={{ background: "#f1f1f1", color: "#000" }}
    >
      <div className="absolute top-6 left-6 ck-chapter text-black/60">
        CHAPTER 03 / THE MARK
      </div>
      <div className="absolute top-6 right-6 ck-chapter text-black/40">
        2X PROTECTION ZONE
      </div>

      <div
        className="lion-word-this absolute ck-display ck-outline-thick"
        style={{ color: "#000", top: "18%", left: "8%", fontSize: "11vw" }}
      >
        THIS
      </div>
      <div
        className="lion-word-is absolute ck-display ck-outline-thick"
        style={{ color: "#000", top: "18%", right: "8%", fontSize: "11vw" }}
      >
        IS
      </div>
      <div
        className="lion-word-our absolute ck-display ck-outline-thick"
        style={{ color: "#000", bottom: "18%", left: "8%", fontSize: "11vw" }}
      >
        OUR
      </div>
      <div
        className="lion-word-mark absolute ck-display ck-outline-thick"
        style={{ color: "#000", bottom: "18%", right: "8%", fontSize: "11vw" }}
      >
        MARK
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="lion-protection absolute pointer-events-none"
            style={{ inset: "-36%", border: "1px dashed rgba(0,0,0,0.55)" }}
          />
          <img
            src={`${BASE}playground/cairokee/lion.png`}
            alt="Cairokee Lion"
            className="lion-mark relative w-[22vw] md:w-[18vw] max-w-[280px] min-w-[180px] select-none"
            draggable={false}
          />
        </div>
      </div>

      <p className="lion-caption absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-black/70 max-w-md px-4 text-sm md:text-base">
        The Lion lives in its protected space.
        <br />
        It never rotates, changes color, or bends to trends.
      </p>
    </section>
  );
}
