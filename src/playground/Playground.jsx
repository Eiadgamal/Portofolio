import { Link } from "react-router-dom";
import SmoothScroll from "./SmoothScroll";
import HeroReveal from "./HeroReveal";
import PinnedParallax from "./PinnedParallax";
import ImageSequence from "./ImageSequence";
import CanvasParticles from "./CanvasParticles";

export default function Playground() {
  return (
    <SmoothScroll>
      <main className="bg-black text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 text-xs tracking-widest backdrop-blur-sm bg-black/30">
          <span className="text-white/70">PLAYGROUND</span>
          <Link to="/" className="text-white/50 hover:text-white">
            ← BACK TO PORTFOLIO
          </Link>
        </nav>

        <HeroReveal />
        <PinnedParallax />
        <ImageSequence />
        <CanvasParticles />

        <section className="min-h-[70vh] flex flex-col items-center justify-center bg-black text-center px-6">
          <div className="text-xs tracking-[0.5em] text-white/40 mb-4">
            END OF SESSION 1
          </div>
          <h3 className="text-3xl md:text-5xl font-black">
            4 techniques. Infinite combinations.
          </h3>
          <p className="mt-6 max-w-xl text-white/50">
            Next session: horizontal pinned scroll · kinetic marquees · scroll-synced
            color palette · magnetic cursor · shader backgrounds.
          </p>
        </section>
      </main>
    </SmoothScroll>
  );
}
