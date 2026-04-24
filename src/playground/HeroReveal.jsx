import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HeroReveal() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const chars = rootRef.current.querySelectorAll(".char");
      const sub = rootRef.current.querySelector(".subline");

      gsap.set(chars, { y: 120, opacity: 0, rotateX: -90 });
      gsap.set(sub, { y: 30, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(chars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.04,
      }).to(
        sub,
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      gsap.to(rootRef.current.querySelector(".shine"), {
        x: "120%",
        duration: 2.2,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 2.5,
      });
    },
    { scope: rootRef }
  );

  const title = "CINEMATIC";
  const split = title.split("");

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#0b0a16] text-white overflow-hidden"
    >
      <div className="text-xs tracking-[0.5em] text-white/40 mb-6">
        POC 2 — HERO TEXT REVEAL
      </div>

      <h1
        className="relative text-[18vw] md:text-[14vw] font-black leading-none select-none"
        style={{ perspective: 600 }}
      >
        {split.map((c, i) => (
          <span key={i} className="char inline-block will-change-transform">
            {c === " " ? " " : c}
          </span>
        ))}
        <span
          className="shine pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
            transform: "translateX(-120%)",
            mixBlendMode: "overlay",
          }}
        />
      </h1>

      <p className="subline mt-8 text-lg md:text-xl text-white/60 tracking-widest uppercase">
        GSAP · stagger · easing · perspective
      </p>

      <div className="absolute bottom-10 text-xs text-white/30 tracking-widest">
        SCROLL ↓
      </div>
    </section>
  );
}
