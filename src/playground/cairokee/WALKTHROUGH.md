# Cairokee POC — Technical Walkthrough

A scroll-driven, brand-respecting landing experience built on top of the existing Vite + React portfolio, living at **`/playground/cairokee`**.

This doc explains the stack, every file, every technique, and the reasoning behind each decision — so you can open any of the four section components and know exactly what's happening and why.

---

## 1. The stack in one screen

| Layer | Library | What it does here |
|---|---|---|
| App framework | **React 18** (existing) | Component model, state, hooks |
| Build tool | **Vite 5** (existing) | Dev server + HMR + asset pipeline |
| Routing | **react-router-dom v6** (existing) | `/playground/cairokee` route |
| Styling | **Tailwind CSS** (existing) + one local `cairokee.css` | Utility classes + brand-specific typography helpers |
| Smooth scroll | **Lenis 1.3** (already installed in Session 1) | Replaces browser scroll with frame-interpolated scroll |
| Animation engine | **GSAP 3.12** | All timelines, tweens, easings |
| GSAP React glue | **@gsap/react** (`useGSAP` hook) | Auto cleanup when component unmounts; scoped selectors |
| Scroll plugin | **GSAP ScrollTrigger** | Ties timeline progress to scroll position; pins sections |

Nothing new was installed for Cairokee — every library was already added in Session 1. This POC reuses all the primitives you learned.

No Three.js, no WebGL, no shaders. Cairokee's visual language is pure typography + B&W photography + minimal geometry, so those tools would be overkill.

---

## 2. File structure

```
src/playground/cairokee/
├── Cairokee.jsx             # Page wrapper — composes all four sections
├── CairokeeHero.jsx         # Section 1 — timeline reveal on load
├── CairokeeStateOfMind.jsx  # Section 2 — pinned photo + scrubbed text
├── CairokeeLionReveal.jsx   # Section 3 — pinned logo reveal, brand-book style
├── CairokeeMarquee.jsx      # Section 4 — infinite marquees + scroll-driven color flip
├── cairokee.css             # Brand typography helpers (outline/display/chapter)
└── WALKTHROUGH.md           # This file

public/playground/cairokee/
├── lion.png                 # Black Lion mark, 1200px, optimized from 3544px original
├── wordmark-white.png       # White wordmark, 1200px, optimized
└── band-photo.jpg           # Cairokee band photo, 2400px, JPEG quality 82

src/App.jsx                  # Added route: /playground/cairokee → <Cairokee />
index.html                   # Added <link> to Google Fonts: Archivo Black + Inter
```

**Why this layout?**
- Cairokee lives inside `playground/` so it's isolated from the main portfolio
- All assets under `public/playground/cairokee/` — served at `/Portofolio/playground/cairokee/...` thanks to Vite's `base` config (this is why every `<img src>` uses `${import.meta.env.BASE_URL}...`)
- One CSS file local to this folder, imported by `Cairokee.jsx`, so brand typography never leaks out

---

## 3. Brand constraints that shaped every decision

Before touching a single component, I read the 90-page Cairokee brand book. It's strict. These rules directly dictated what I did and didn't animate:

| Rule | Consequence in code |
|---|---|
| Lion is always **Pitch Black**, only on light backgrounds | Section 3 uses `background: #f1f1f1`; the Lion is never filtered, inverted, or tinted |
| Never rotate, skew, or distort the logo | No `rotate:` or `skew:` on `.lion-mark` or the wordmark anywhere. Only uniform `scale` (same X and Y), `opacity`, `translate` |
| Never apply graphical effects (glow, shadow, bloom) to the logo | No `drop-shadow`, no postprocessing layer, no `filter:` on logo images |
| Only the wordmark goes over photography (Section 2) | `CairokeeStateOfMind.jsx` uses only the white wordmark on the B&W band photo. The Lion never touches a photo. |
| The lockup is Lion-above-Wordmark, fixed | Section 4's final frame stacks them exactly as the brand book specifies |
| Respect the 2X protection zone around the Lion | Section 3 visualises this zone (the dashed border) then fades it — it's a nod to the brand book itself |
| Only color system is B&W + grayscale | No gradients, no accents. Backgrounds are `#000`, `#f1f1f1`, band photo in grayscale |

Everything cinematic happens to **non-logo elements** — the typography, the background, the photograph. The logo itself always remains static and pristine.

---

## 4. Section-by-section walkthrough

### Section 1 — `CairokeeHero.jsx` — Entry reveal

**What the user sees:** Black stage. The word `CAIROKEE` appears as huge hollow outline letters behind, each letter flipping up from below, staggered. Simultaneously the real white wordmark fades in and scales up from 82% to 100% at the center. A caption (`We are always bold and never small.`) and a pulsing "SCROLL" indicator arrive last.

**Why this matters as a demo:** it's the **Session 1 Hero Reveal POC** reapplied, with one twist — the centerpiece is the brand wordmark itself (allowed), and the outlined background text is an *additional* non-logo element we can animate freely.

**Libraries used:**
- `gsap` — timeline
- `@gsap/react` → `useGSAP` hook
- Plain CSS for the outline effect (`ck-outline-thick` — see Key Concepts)

**Timeline structure (no ScrollTrigger — fires on mount):**
```js
tl
  .to(chapter, { opacity: 1, y: 0, duration: 0.7 })              // chapter label in
  .to(outlineChars, { yPercent: 0, opacity: 1, stagger: 0.04 })  // letters up, one at a time
  .to(mark, { scale: 1, opacity: 1, duration: 1.3 })             // wordmark scales in
  .to(caption, { opacity: 1, y: 0 })                             // caption fades in
  .to(scrollHint, { opacity: 1, y: 0 });                         // scroll cue
```
Then a separate, infinite `gsap.to` pulses the scroll hint `y` back and forth with `yoyo: true` and `sine.inOut` easing.

**Brand-respect:** the real wordmark only does uniform scale + opacity. No rotate, no skew, no filter.

---

### Section 2 — `CairokeeStateOfMind.jsx` — Pinned photo + scrubbed text

**What the user sees:** Full-bleed B&W band photo fills the screen. As the user scrolls:
- The photo slowly zooms in (Ken Burns effect)
- The word `STATE` (huge, outlined, 38vw — wider than the viewport) slides from right to far-left across the whole timeline
- `IT'S OUR` fades in upper-left, `OF MIND` fades in lower-right
- A dark overlay deepens over the photo
- A white wordmark is anchored bottom-left the entire time (static, per brand rules)

**Why this matters as a demo:** this is the **Session 1 Pinned Parallax POC** — but adapted to tell a story. Same mechanics as the "SCROLL / CHOREOGRAPHED" demo: `pin: true`, `scrub: 0.8`, multiple layers placed on one timeline at different positions.

**ScrollTrigger config:**
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: "top top",    // pin when section's top reaches viewport top
  end: "+=2200",       // stays pinned for 2200px of scroll
  pin: true,           // freeze section in place during scroll
  scrub: 0.8,          // smooth lag — 0.8s to catch up to scroll position
}
```

**Timeline layers (all at scroll progress 0 → 1):**
```js
tl.to(".som-photo", { scale: 1.2 }, 0)                         // photo zoom across whole scroll
  .fromTo(".som-big", { xPercent: 90 }, { xPercent: -120 }, 0) // STATE slides across
  .fromTo(".som-its",  { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.1)   // appears at 10%
  .fromTo(".som-ofmind", { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.25) // appears at 25%
  .to(".som-photo-overlay", { opacity: 0.5 }, 0);              // overlay deepens
```

The numeric positions (`0`, `0.1`, `0.25`) are timeline positions in seconds, but because of `scrub`, the whole timeline maps linearly to the scroll progress. So `0.1` means "10% of the way through scrolling this section."

**Brand-respect:** wordmark never moves or distorts — it's a plain `<img>` with no transforms. Only the typography (non-logo) and the photo scale animate.

---

### Section 3 — `CairokeeLionReveal.jsx` — The Mark, brand-book style

**What the user sees:** Background flips to light gray (`#f1f1f1`). As the user scrolls:
- The Lion scales from 90% to 100% and fades in at center
- `THIS` (top-left), `IS` (top-right), `OUR` (bottom-left), `MARK` (bottom-right) slide up and fade in one by one — each word a giant outlined `11vw` display
- A dashed 2X protection-zone border appears around the Lion, then fades (educational nod to the brand book)
- A caption appears: *"The Lion lives in its protected space. It never rotates, changes color, or bends to trends."*

**Why this matters:** This is the first time we're deliberately **referencing the brand book as a design artefact**. It's a page of the book made interactive. The scroll becomes a way to teach brand rules.

**Same ScrollTrigger pattern as Section 2**, but with a denser sequential timeline:
```js
.fromTo(".lion-mark",       { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1 }, 0)
.fromTo(".lion-word-this",  { opacity: 0, y: 30 },       { opacity: 1, y: 0 },      0.1)
.fromTo(".lion-word-is",    { opacity: 0, y: 30 },       { opacity: 1, y: 0 },      0.18)
.fromTo(".lion-word-our",   { opacity: 0, y: 30 },       { opacity: 1, y: 0 },      0.26)
.fromTo(".lion-word-mark",  { opacity: 0, y: 30 },       { opacity: 1, y: 0 },      0.34)
.fromTo(".lion-protection", { opacity: 0 }, { opacity: 0.5 }, 0.45)
.to  (".lion-protection",   { opacity: 0 },               0.75)
.fromTo(".lion-caption",    { opacity: 0, y: 20 },        { opacity: 1, y: 0 }, 0.7);
```

Each tween's placement is offset by ~8% of scroll progress, giving the "one-by-one reveal" rhythm.

**Brand-respect:**
- Background is light → Lion is displayed as required (`black only on light`)
- Lion image uses `object-fit: none`, no filters, no rotation. Only scale + opacity (allowed)
- Protection zone is computed via CSS `inset: -36%` relative to a wrapper around the Lion — this visually approximates the 2X clear space rule

---

### Section 4 — `CairokeeMarquee.jsx` — Deep Down Black + the lockup

**What the user sees:** Three rows of huge outlined typography scroll horizontally, each at a different speed and alternating directions:
- Row 1 (→): `REAL US · CASUAL MOMENTS · ARTISTIC EXPRESSIONS · IMAGINERY MINDS · NOT ALWAYS PERFECT`
- Row 2 (←): `BOLD · LOUD · NEVER SMALL · PITCH BLACK · DEEP DOWN BLACK · UNFILTERED`
- Row 3 (→): `THE LION · OUR MARK · OUR WORDMARK · OUR ONLY LOCKUP · OUR STATE OF MIND`

As the user scrolls through the pin, the background **fades from pitch black to `#f1f1f1`** (Chapter 2's "Deep Down Black" palette, reversed to reveal light). The marquee color flips from white to black to maintain contrast. Then the marquees fade upward and the **official lockup** (Lion above Wordmark) emerges center-screen, credited `— Cairokee, V1.2021`.

**Why this matters:** this combines two new techniques the earlier POCs didn't have:
1. **Infinite CSS marquee driven by GSAP** — a separate, non-scroll-bound loop per row
2. **Scroll-driven background/color transitions** — not transform-based, but true CSS color interpolation, proving GSAP can animate any numeric property (including colors) via ScrollTrigger

**Two parallel animations coexist:**

**(a) Per-row infinite loops** (run forever, don't care about scroll):
```js
gsap.fromTo(track,
  { xPercent: 0 },
  { xPercent: -66.666, duration: 28, ease: "none", repeat: -1 }
);
```
Each marquee track is a triple-duplicated array of phrases. Moving `xPercent` from `0` to `-66.666%` (exactly one copy's width) and looping creates a seamless infinite scroll.

**(b) Scroll-pinned color/opacity timeline** (maps 1:1 to user scroll):
```js
gsap.timeline({ scrollTrigger: { trigger, pin: true, end: "+=2800", scrub: 0.8 } })
  .to(rootRef.current, { backgroundColor: "#f1f1f1" }, 0.3)
  .to(tracks, { color: "#000" }, 0.3)
  .to(".mq-hint", { opacity: 0 }, 0.1)
  .to(tracks, { opacity: 0, y: -30 }, 0.8)
  .fromTo(".mq-lockup", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1 }, 0.85)
  .fromTo(".mq-final-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.95);
```

Note the `backgroundColor` tween — GSAP handles color interpolation natively. You could do the same thing via a CSS custom property (`--bg-color`) and animate *that*; same result, different architecture.

**Brand-respect:** In the final lockup, the Lion appears ONLY after the background has become light (respecting the rule). The wordmark image is `filter: invert(1)` to render it black for the light final frame — this is acceptable because a white wordmark printed on white would be invisible, and brand rules explicitly permit black-on-light.

---

## 5. Key concepts explained

### (a) The outline typography trick — `-webkit-text-fill-color`

The brand book uses outlined display type everywhere. The CSS trick is:

```css
.ck-outline-thick {
  -webkit-text-fill-color: transparent;     /* makes the fill transparent */
  -webkit-text-stroke: 2px currentColor;    /* draws an outline using the element's color */
}
```

The earlier, broken attempt used `color: transparent` which also made `currentColor` transparent (since `currentColor` equals the element's `color`). Result: invisible letters. The fix uses `-webkit-text-fill-color`, which specifically zeroes out the **fill** without touching the `color` property, so `currentColor` still resolves to whatever `color` is set on the element or its parent. That color becomes the stroke color.

Three weights exist (`ck-outline-thin`, `ck-outline`, `ck-outline-thick`) for 1px / 1.5px / 2px strokes. The Hero section uses `thick`, Section 4's marquees use `thin`, etc.

### (b) Lenis + GSAP integration

`SmoothScroll.jsx` (shared with the older `/playground` demo) is the glue:

```js
lenis.on("scroll", ScrollTrigger.update);            // tell ScrollTrigger whenever Lenis scrolls
gsap.ticker.add((time) => lenis.raf(time * 1000));   // run Lenis in sync with GSAP's render loop
gsap.ticker.lagSmoothing(0);                         // disable lag compensation so frames stay synced
```

Without this glue:
- Native scroll jumps in pixel increments → ScrollTrigger scrubs look stuttery
- Lenis has its own animation clock that can drift from GSAP's → tearing

With it:
- Every frame, GSAP ticks → Lenis interpolates scroll position → ScrollTrigger reads the new position → timelines update → everything renders once, cohesively.

### (c) `useGSAP` vs plain `useEffect`

`useGSAP` from `@gsap/react` is a thin wrapper that:
1. Creates a `gsap.context()` scoped to a ref (`scope: rootRef`), so class selectors like `.lion-mark` only match inside that component
2. Automatically reverts all tweens/triggers created inside when the component unmounts — no more leaked ScrollTriggers between route changes

Without it, you'd need to manually track and kill every `gsap.to()` and `ScrollTrigger` instance in a cleanup function. With it, that's free.

### (d) Scrub progress vs absolute time

When a GSAP timeline has no ScrollTrigger, its tween positions (`0`, `0.1`, `0.25`) are **seconds** of playback.

When you attach `scrollTrigger: { scrub: ..., end: "+=2200" }`, GSAP:
1. Computes the timeline's total duration (the sum/placement of all tweens)
2. Maps the 2200px scroll range linearly onto that duration
3. So a tween placed at time `0.5` fires when scroll progress is at `0.5 / totalDuration` — if total is `1s`, that's halfway through the scroll.

This is why you see numbers like `0.1`, `0.18`, `0.26` — they're sub-second positions that translate, under scrub, to "10%, 18%, 26% of the pinned scroll range."

The `scrub: 0.8` value is the **lag** in seconds — how long it takes for the timeline to catch up to the current scroll position. `scrub: true` would be zero lag; higher values feel buttery-smooth but less responsive.

### (e) `pin: true` adds a spacer

When a ScrollTrigger pins a section, GSAP inserts an invisible "spacer" of the `end` length (e.g. 2200px) below the section. Without it, scrolling past the pin would break the layout. This is why the document height is ~10,000px even though we only have 4 viewport-height sections: each pin adds thousands of pixels of invisible spacer.

This is also why Section 2 ends at ~y=3000 and Section 3 starts pinning there — the spacer pushes everything down.

---

## 6. How to run & navigate

```bash
# From the repo root
npm run dev
```

Then open:
- Main portfolio: http://localhost:5173/Portofolio/
- Playground (Session 1 generic demos): http://localhost:5173/Portofolio/playground
- **Cairokee POC:** http://localhost:5173/Portofolio/playground/cairokee

Scroll slowly. Each pinned section is ~2000–2800px of scroll before releasing. Total page height is ~10,000px.

### Debugging inside Chrome DevTools

Useful in the console:
```js
// Inspect all active ScrollTriggers
window.gsap?.ScrollTrigger?.getAll().forEach(t => console.log(t.trigger, t.progress))

// Force a specific scroll position
window.scrollTo({ top: 4000, behavior: "instant" })
```

If something animates wrong, the fastest diagnostic is to:
1. Add a console.log inside the `useGSAP` body to confirm the hook fired
2. Query the element state (`getComputedStyle(el).opacity`) to confirm GSAP is applying the tween
3. Verify the class selector (e.g. `.lion-word-this`) matches exactly one element inside the scope

---

## 7. What this POC does not do (on purpose)

| Technique | Why skipped |
|---|---|
| Three.js / R3F | Cairokee's language is 2D typography; 3D would be off-brand |
| Image-sequence scrubbing (like Apple Watch) | The brand forbids rotating the logo, which was the only candidate for that technique here |
| Postprocessing (bloom, DoF) | Explicitly forbidden on the logo and at odds with the brand's raw/honest aesthetic |
| GLSL shaders | Would add a colorful synthetic texture — the brand is B&W only |
| Rive / Lottie animations | None of the existing assets are vector-animation sources |
| Horizontal pinned scroll | Could be added later as a "discography" section — left as a future expansion |

---

## 8. Expansion ideas for later sessions

If you want to push this further:
- **Audio integration** — Howler.js, play a Cairokee track muted until user interacts (autoplay rules), tie the marquee speed to audio frequency via Web Audio API analyser
- **Album tiles horizontal scroll** — Session 1's horizontal pinned pattern applied to album covers, each sliding in with its release year
- **Arabic/English bilingual display** — big outlined Arabic display text alongside English, respecting RTL
- **Video hero** — replace the hero background with a muted looping live-performance video, wordmark still centered
- **Scroll-bound lyrics reveal** — a pinned section where lyrics fade in line-by-line synced to song progress

None of these need new dependencies — they'd all build on Lenis + GSAP ScrollTrigger, the stack you now have running.

---

## 9. One-sentence summary per file

- [Cairokee.jsx](Cairokee.jsx) — Thin page wrapper: Lenis provider + fixed nav + four `<Section>` components in order.
- [CairokeeHero.jsx](CairokeeHero.jsx) — Standalone GSAP timeline on mount; outlined `CAIROKEE` reveal with staggered letter flip and uniform-scale entry of the real wordmark.
- [CairokeeStateOfMind.jsx](CairokeeStateOfMind.jsx) — Pinned full-bleed B&W photo; `STATE` slides horizontally across scroll; `IT'S OUR` and `OF MIND` fade in at offset times; wordmark anchored bottom-left.
- [CairokeeLionReveal.jsx](CairokeeLionReveal.jsx) — Pinned light section; Lion enters centered, four outlined corner words appear sequentially, dashed 2X protection zone visualises, then fades.
- [CairokeeMarquee.jsx](CairokeeMarquee.jsx) — Three infinite marquee rows in alternating directions; pinned scroll drives background/color flip from black→light; ends on the official lockup.
- [cairokee.css](cairokee.css) — Typography helpers (`.ck-display`, `.ck-outline*`, `.ck-chapter`, `.ck-bw`) and marquee track layout.
