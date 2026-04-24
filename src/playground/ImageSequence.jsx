import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { generateTorusFrames } from "./frameGenerator";

gsap.registerPlugin(ScrollTrigger);

export default function ImageSequence() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const progressRef = useRef({ frame: 0 });

  useEffect(() => {
    const f = generateTorusFrames({ count: 80, size: 600 });
    setFrames(f);
  }, []);

  useGSAP(
    () => {
      if (frames.length === 0) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const paint = () => {
        const idx =
          Math.max(
            0,
            Math.min(frames.length - 1, Math.floor(progressRef.current.frame))
          );
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[idx], 0, 0, canvas.width, canvas.height);
      };

      paint();

      gsap.to(progressRef.current, {
        frame: frames.length - 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: 0.5,
          onUpdate: paint,
        },
      });
    },
    { scope: rootRef, dependencies: [frames] }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-screen bg-[#05050a] text-white overflow-hidden"
    >
      <div className="absolute top-20 left-6 text-xs tracking-[0.4em] text-white/40 z-10">
        POC 4 — IMAGE SEQUENCE SCRUB
      </div>
      <div className="absolute top-20 right-6 text-xs text-white/40 text-right z-10">
        APPLE'S SIGNATURE MOVE
        <br />
        <span className="text-white/30">{frames.length} frames · canvas 2D</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="max-w-[85vw] max-h-[85vh] drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]"
        />
      </div>

      <div className="absolute left-1/2 bottom-24 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-3xl md:text-5xl font-black tracking-tight">
          SCROLL TO{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-300">
            ROTATE
          </span>
        </div>
        <div className="mt-3 text-sm text-white/40">
          Scroll position drives frame index. Real Apple pages swap in rendered PNGs.
        </div>
      </div>

      <div className="absolute bottom-6 right-6 text-xs text-white/40 tracking-widest z-10">
        {frames.length === 0 ? "GENERATING FRAMES..." : "↓"}
      </div>
    </section>
  );
}
