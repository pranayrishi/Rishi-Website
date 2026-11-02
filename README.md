# rishinalem.com

Personal site of Rishi (Pranay Rishi Nalem). A static site with no build step: open `index.html`, or serve the folder with any static host.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page: research figures, building, projects, honors, path, contact |
| `assets/site.css` | All styles. Colour and type tokens are at the top in `:root` |
| `assets/main.js` | Name reveal, figures 1–4, command menu (⌘K), drawer, toasts, scroll choreography (GSAP ScrollTrigger) |
| `assets/field.js` | The three.js particle field behind the page and the nearest-neighbour probe |
| `assets/chapters.js` | The shapes the particle field takes for Figs. 5–11 (proof ∎, orbit, protein, spin lattice, flakes, attractor, drone swarm) |
| `assets/viz.js` | The research timeline and the charts in Figs. 6 and 11, Building and Honors |
| `assets/cat.js` | Fig. 12, the interactive cat in a sink (drag the state diagram, click to pet) |
| `assets/img/` | Portrait and project photos (WebP) |
| `assets/papers/` | PDFs linked from the page |
| `legacy/` | The previous version of the site, kept as it was |
| `images/` | Original photos used by the legacy site |
| `rishinalem-v2/` | An earlier Next.js experiment, untouched |

## Common edits

- **Links** (GitHub, LinkedIn, Scholar, CV): the `LINKS` list at the top of `assets/main.js`. Entries with an empty `href` are hidden.
- **Earlier builds** (title, year, photo, video): the `BUILDS` list in `assets/main.js`.
- **Research timeline bars**: the `PROJECTS` list in `assets/viz.js`.
- **Copy**: everything else is plain HTML in `index.html`.

Libraries load from CDNs pinned to exact versions: three.js 0.160.0 (jsDelivr) and GSAP 3.12.5 with ScrollTrigger (cdnjs). Fonts are Schibsted Grotesk and Newsreader from Google Fonts.

The page respects reduced-motion settings, works without WebGL, and is keyboard navigable. Press ⌘K (or Ctrl K) to jump anywhere.
