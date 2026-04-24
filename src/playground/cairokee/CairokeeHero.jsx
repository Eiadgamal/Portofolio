import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const BASE = import.meta.env.BASE_URL;

export default function CairokeeHero() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const outlineChars = rootRef.current.querySelectorAll(".hero-char");
      const mark = rootRef.current.querySelector(".hero-mark");
      const chapter = rootRef.current.querySelector(".hero-chapter");
      const caption = rootRef.current.querySelector(".hero-caption");
      const scrollHint = rootRef.current.querySelector(".hero-scroll");

      gsap.set(outlineChars, { yPercent: 120, opacity: 0 });
      gsap.set(mark, { scale: 0.82, opacity: 0 });
      gsap.set([chapter, caption, scrollHint], { opacity: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(chapter, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      })
        .to(
          outlineChars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.06,
          },
          "-=0.2"
        )
        .to(
          mark,
          {
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          caption,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          scrollHint,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );

      gsap.to(scrollHint, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef }
  );

  const outlineWord = "CAIROKEE";

  return (
    <section
      ref={rootRef}
      className="ck-root relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="hero-chapter absolute top-20 left-6 ck-chapter text-white/60 z-20">
        CHAPTER 01 / THE BAND
      </div>
      <div className="absolute top-20 right-6 ck-chapter text-white/40 z-20">
        POC — CAIROKEE
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <div className="flex ck-display ck-outline-thick" style={{ fontSize: "22vw" }}>
          {outlineWord.split("").map((c, i) => (
            <span
              key={i}
              className="hero-char inline-block will-change-transform"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <img
        src={`${BASE}playground/cairokee/wordmark-white.png`}
        alt="CAIROKEE"
        className="hero-mark relative z-10 w-[62vw] md:w-[46vw] max-w-[820px] select-none"
        draggable={false}
      />

      <p className="hero-caption absolute bottom-32 left-1/2 -translate-x-1/2 text-center text-white/70 max-w-md px-4 text-sm md:text-base leading-relaxed">
        We are always bold and never small.
      </p>

      <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 ck-chapter text-white/40 flex flex-col items-center gap-2">
        <span>SCROLL</span>
        <span className="block w-px h-6 bg-white/40" />
      </div>
    </section>
  );
}
