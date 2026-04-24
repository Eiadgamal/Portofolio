import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

const ROW_1 = [
  "REAL US",
  "CASUAL MOMENTS",
  "ARTISTIC EXPRESSIONS",
  "IMAGINERY MINDS",
  "NOT ALWAYS PERFECT",
];
const ROW_2 = [
  "BOLD",
  "LOUD",
  "NEVER SMALL",
  "PITCH BLACK",
  "DEEP DOWN BLACK",
  "UNFILTERED",
];
const ROW_3 = [
  "THE LION",
  "OUR MARK",
  "OUR WORDMARK",
  "OUR ONLY LOCKUP",
  "OUR STATE OF MIND",
];

function Marquee({ items, direction = 1, speed = 28 }) {
  const loop = [...items, ...items, ...items];
  return (
    <div
      className="ck-marquee-track"
      data-direction={direction}
      data-speed={speed}
    >
      {loop.map((s, i) => (
        <span
          key={i}
          className="ck-display ck-outline-thin"
          style={{ fontSize: "14vw" }}
        >
          {s} ·
        </span>
      ))}
    </div>
  );
}

export default function CairokeeMarquee() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tracks = rootRef.current.querySelectorAll(".ck-marquee-track");
      tracks.forEach((track) => {
        const dir = Number(track.dataset.direction) || 1;
        const speed = Number(track.dataset.speed) || 28;
        const from = dir > 0 ? 0 : -66.666;
        const to = dir > 0 ? -66.666 : 0;
        gsap.fromTo(
          track,
          { xPercent: from },
          {
            xPercent: to,
            duration: speed,
            ease: "none",
            repeat: -1,
          }
        );
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=2800",
            pin: true,
            scrub: 0.8,
          },
        })
        .to(
          rootRef.current,
          { backgroundColor: "#f1f1f1", ease: "none" },
          0.3
        )
        .to(tracks, { color: "#000", ease: "none" }, 0.3)
        .to(".mq-hint", { opacity: 0, ease: "none" }, 0.1)
        .to(tracks, { opacity: 0, y: -30, ease: "power2.in" }, 0.8)
        .fromTo(
          ".mq-lockup",
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            duration: 0.3,
          },
          0.85
        )
        .fromTo(
          ".mq-final-text",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
          0.95
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="ck-root relative h-screen overflow-hidden flex flex-col justify-center gap-[3vw]"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <div className="absolute top-6 left-6 ck-chapter opacity-60 z-20">
        CHAPTER 04 / DEEP DOWN BLACK
      </div>
      <div className="mq-hint absolute top-6 right-6 ck-chapter opacity-40 z-20">
        SCROLL TO FADE INTO LIGHT
      </div>

      <div className="relative w-full overflow-hidden">
        <Marquee items={ROW_1} direction={1} speed={32} />
      </div>
      <div className="relative w-full overflow-hidden">
        <Marquee items={ROW_2} direction={-1} speed={24} />
      </div>
      <div className="relative w-full overflow-hidden">
        <Marquee items={ROW_3} direction={1} speed={36} />
      </div>

      <div className="mq-lockup absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none opacity-0">
        <img
          src={`${BASE}playground/cairokee/lion.png`}
          alt="Cairokee Lion"
          className="w-[18vw] md:w-[14vw] max-w-[220px] min-w-[180px] select-none"
          draggable={false}
        />
        <img
          src={`${BASE}playground/cairokee/wordmark-white.png`}
          alt="CAIROKEE"
          className="w-[30vw] md:w-[22vw] max-w-[380px] select-none"
          draggable={false}
          style={{ filter: "invert(1)" }}
        />
        <div className="mq-final-text mt-6 text-center text-black/70 max-w-md px-4 text-sm md:text-base">
          The only lockup. The only mark.
          <br />
          <span className="opacity-60">— Cairokee, V1.2021</span>
        </div>
      </div>
    </section>
  );
}
