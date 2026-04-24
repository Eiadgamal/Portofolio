import { Link } from "react-router-dom";
import SmoothScroll from "../SmoothScroll";
import CairokeeHero from "./CairokeeHero";
import CairokeeStateOfMind from "./CairokeeStateOfMind";
import CairokeeLionReveal from "./CairokeeLionReveal";
import CairokeeMarquee from "./CairokeeMarquee";
import "./cairokee.css";

export default function Cairokee() {
  return (
    <SmoothScroll>
      <main className="bg-black">
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 text-[10px] tracking-[0.35em] uppercase backdrop-blur-sm bg-black/40 text-white/70">
          <span>THE CAIROKEE BOOK — SCROLL EDITION</span>
          <Link to="/playground" className="hover:text-white">
            ← PLAYGROUND
          </Link>
        </nav>

        <CairokeeHero />
        <CairokeeStateOfMind />
        <CairokeeLionReveal />
        <CairokeeMarquee />
      </main>
    </SmoothScroll>
  );
}
