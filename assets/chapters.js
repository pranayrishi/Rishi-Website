/* Particle "chapters" for Figs. 5–11.
   Each figure on the page has an empty .stage element. As you scroll, the same particles that
   drew Figs. 1–2 fly to the nearest stage and take that figure's shape. Shapes are computed
   here on the CPU in each stage's local frame (x in [-1, 1], y in [-0.8, 0.8]) and mapped to
   world space from the stage's on-screen rectangle. */

const COB = [0.169, 0.247, 0.878], INK = [0.114, 0.137, 0.188], SLATE = [0.341, 0.376, 0.447],
  GREY = [0.62, 0.65, 0.7], TEAL = [0.059, 0.478, 0.518], VIO = [0.416, 0.267, 0.839], SKY = [0.231, 0.557, 0.878];
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x) => x * x * (3 - 2 * x);
const ease = (x) => 1 - (1 - x) ** 3;
const fract = (x) => x - Math.floor(x);
function mixc(a, b, t, o) { o.r = a[0] + (b[0] - a[0]) * t; o.g = a[1] + (b[1] - a[1]) * t; o.b = a[2] + (b[2] - a[2]) * t; }
function setc(c, o) { o.r = c[0]; o.g = c[1]; o.b = c[2]; }
function rotY(o, a) { const c = Math.cos(a), s = Math.sin(a), x = o.x * c + o.z * s, z = -o.x * s + o.z * c; o.x = x; o.z = z; }
function rotX(o, a) { const c = Math.cos(a), s = Math.sin(a), y = o.y * c - o.z * s, z = o.y * s + o.z * c; o.y = y; o.z = z; }
function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
function gaussR(R) { let u = 0, v = 0; while (u === 0) u = R(); while (v === 0) v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * v); }

export function createChapters(N) {
  const R = seeded(2026);
  const r1 = new Float32Array(N), r2 = new Float32Array(N), r3 = new Float32Array(N), g1 = new Float32Array(N), g2 = new Float32Array(N), g3 = new Float32Array(N);
  for (let i = 0; i < N; i++) { r1[i] = R(); r2[i] = R(); r3[i] = R(); g1[i] = gaussR(R); g2[i] = gaussR(R); g3[i] = gaussR(R); }

  /* ---- precomputed data ---- */
  // Protein: a compact random-walk chain of 326 residues
  const NRES = 326, beads = new Float32Array(NRES * 3);
  { let x = 0, y = 0, z = 0, dx = 1, dy = 0, dz = 0, k = 0;
    const steer = () => { const rr = Math.hypot(x, y, z); if (rr > 0.42) { dx -= x * 0.9; dy -= y * 0.9; dz -= z * 0.9; } };
    const norm = () => { const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l; };
    while (k < NRES) {
      const helix = R() < 0.6, len = helix ? 11 + Math.floor(R() * 8) : 4 + Math.floor(R() * 6);
      // a perpendicular basis for the helix around the current direction
      let ux = -dy, uy = dx, uz = 0; if (Math.hypot(ux, uy) < 0.1) { ux = 0; uy = -dz; uz = dy; }
      let l = Math.hypot(ux, uy, uz); ux /= l; uy /= l; uz /= l;
      const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
      const ax = x, ay = y, az = z;
      for (let j = 0; j < len && k < NRES; j++, k++) {
        if (helix) {
          const a = j * 1.75, rad = 0.045, along = j * 0.026;
          x = ax + dx * along + (ux * Math.cos(a) + vx * Math.sin(a)) * rad; y = ay + dy * along + (uy * Math.cos(a) + vy * Math.sin(a)) * rad; z = az + dz * along + (uz * Math.cos(a) + vz * Math.sin(a)) * rad;
        } else {
          dx = dx * 0.7 + gaussR(R) * 0.5; dy = dy * 0.7 + gaussR(R) * 0.5; dz = dz * 0.7 + gaussR(R) * 0.5; steer(); norm();
          x += dx * 0.06; y += dy * 0.06; z += dz * 0.06;
        }
        beads[k * 3] = x; beads[k * 3 + 1] = y; beads[k * 3 + 2] = z;
      }
      dx += gaussR(R) * 0.9; dy += gaussR(R) * 0.9; dz += gaussR(R) * 0.9; steer(); norm();
    }
    let cx = 0, cy = 0, cz = 0; for (let k = 0; k < NRES; k++) { cx += beads[k * 3]; cy += beads[k * 3 + 1]; cz += beads[k * 3 + 2]; }
    cx /= NRES; cy /= NRES; cz /= NRES; let mx = 0; for (let k = 0; k < NRES; k++) { beads[k * 3] -= cx; beads[k * 3 + 1] -= cy; beads[k * 3 + 2] -= cz; mx = Math.max(mx, Math.hypot(beads[k * 3], beads[k * 3 + 1], beads[k * 3 + 2])); }
    const sc = 0.58 / mx; for (let k = 0; k < NRES * 3; k++) beads[k] *= sc; }
  const pocket = new Uint8Array(NRES);
  [...Array(NRES).keys()].map((k) => [k, Math.hypot(beads[k * 3], beads[k * 3 + 1], beads[k * 3 + 2])]).sort((a, b) => a[1] - b[1]).slice(0, 12).forEach(([k]) => (pocket[k] = 1));

  // Flakes on a substrate: polygons in the (x, z) plane with layer counts
  const FL = [[-0.62, -0.28, 0.2, 1], [-0.12, 0.22, 0.26, 3], [0.46, -0.3, 0.18, 1], [0.6, 0.28, 0.2, 2], [-0.55, 0.32, 0.15, 4], [0.05, -0.18, 0.15, 1], [0.22, 0.4, 0.12, 5], [-0.3, -0.05, 0.11, 2], [0.85, -0.05, 0.1, 1]];
  const flakes = FL.map(([cx, cz, r, layers], k) => {
    const n = 6 + (k % 3), pts = [], RR = seeded(40 + k);
    for (let j = 0; j < n; j++) { const a = (j / n) * 6.2831853 + (RR() - 0.5) * 0.6, rr = r * (0.7 + RR() * 0.5); pts.push([cx + Math.cos(a) * rr * 1.25, cz + Math.sin(a) * rr]); }
    return { pts, layers, maxx: Math.max(...pts.map((p) => p[0])), cx, cz, r };
  });
  const inPoly = (x, z, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, zi] = pts[i], [xj, zj] = pts[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
  const flakeOf = new Int16Array(N), flakeLayer = new Int8Array(N), fx = new Float32Array(N), fz = new Float32Array(N);
  { const weights = flakes.map((f) => f.r * f.r * (f.layers + 1)), tot = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < N; i++) {
      if (r1[i] < 0.3) { flakeOf[i] = -1; fx[i] = r2[i] * 2.1 - 1.05; fz[i] = r3[i] * 1.3 - 0.65; continue; }
      if (r1[i] < 0.36) { flakeOf[i] = -2; continue; }
      let pick = fract(r2[i] * 13.37) * tot, k = 0; while (pick > weights[k] && k < flakes.length - 1) { pick -= weights[k]; k++; }
      const f = flakes[k]; let x, z, tries = 0, RR = seeded(i + 7);
      do { x = f.cx + (RR() - 0.5) * f.r * 2.6; z = f.cz + (RR() - 0.5) * f.r * 2.2; tries++; } while (!inPoly(x, z, f.pts) && tries < 40);
      flakeOf[i] = k; flakeLayer[i] = Math.floor(fract(r3[i] * 7.1) * f.layers); fx[i] = x; fz[i] = z;
    } }

  // Mackey-Glass delay embedding
  const MG = (() => {
    const tau = 17, dt = 0.5, lag = Math.round(tau / dt), total = 9000;
    const x = new Float32Array(total); for (let i = 0; i <= lag; i++) x[i] = 1.2;
    for (let i = lag + 1; i < total; i++) { const xd = x[i - 1 - lag]; x[i] = x[i - 1] + dt * ((0.2 * xd) / (1 + xd ** 10) - 0.1 * x[i - 1]); }
    const start = 3000, n = 4000, curve = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) { const a = x[start + k], b = x[start + k - lag], c = x[start + k - 2 * lag]; curve[k * 3] = (a - 0.9) * 1.55; curve[k * 3 + 1] = (b - 0.9) * 1.55; curve[k * 3 + 2] = (c - 0.9) * 1.55; }
    return { curve, n };
  })();

  /* ---- shapes: write local position, colour and alpha for particle i at time t ---- */
  const SH = {
    proof(i, t, o) {
      const a = r1[i];
      o.z = g3[i] * 0.02;
      if (a < 0.05) { o.x = 0.1 + g1[i] * 0.006; o.y = -0.66 + 1.32 * r2[i]; setc(COB, o); o.a = 0.6; return; }
      const sqx = 0.6, sqy = -0.02, half = 0.2;
      if (a < 0.2) { o.x = sqx + (r2[i] - 0.5) * half * 2; o.y = sqy + (r3[i] - 0.5) * half * 2; setc(COB, o); o.a = 0.9; return; }
      const u = fract(r2[i] + t * 0.085), y0 = (r3[i] - 0.5) * 1.25, ok = fract(r3[i] * 31.7) < 0.42;
      if (u < 0.5) {
        const s = u / 0.5;
        o.x = -0.98 + 1.08 * s; o.y = y0 * (1 - 0.6 * s) + 0.02 * Math.sin(t * 2 + i);
        mixc(SLATE, INK, s, o); o.a = 0.78 * clamp01(s * 5);
      } else {
        const s = (u - 0.5) / 0.5;
        if (ok) {
          const e = ease(clamp01(s * 1.8)), tx = sqx + (fract(r2[i] * 7.3) - 0.5) * half * 2, ty = sqy + (fract(r3[i] * 5.1) - 0.5) * half * 2;
          o.x = 0.1 + (tx - 0.1) * e; o.y = y0 * 0.4 + (ty - y0 * 0.4) * e; mixc(INK, COB, e, o); o.a = 0.9 * (1 - clamp01((s - 0.86) / 0.14));
        } else {
          o.x = 0.1 + 0.3 * s + g1[i] * 0.04 * s; o.y = y0 * 0.4 - 1.5 * s * s; setc(GREY, o); o.a = 0.7 * (1 - s);
        }
      }
    },
    orbit(i, t, o) {
      const a = r1[i];
      if (a < 0.16) { // Earth's limb
        const ph = (r2[i] - 0.5) * 0.72, rad = 3 + (a < 0.11 ? g1[i] * 0.01 : 0.03 + r3[i] * 0.07);
        o.x = rad * Math.sin(ph); o.y = -0.66 - 3 + rad * Math.cos(ph); o.z = 0; if (a < 0.11) { setc(INK, o); o.a = 0.55; } else { setc(SKY, o); o.a = 0.3 * (1 - r3[i]); } return;
      }
      if (a < 0.22) { o.x = g1[i] * 0.025; o.y = 0.1 + g2[i] * 0.025; o.z = g3[i] * 0.025; setc(INK, o); o.a = 0.95; return; }
      let along, radial, col, al;
      if (a < 0.7) {
        const th = 6.2831853 * fract(r2[i] + t * 0.05);
        along = 0.66 * Math.sin(th) + g1[i] * 0.012; radial = 0.33 * Math.cos(th) + g2[i] * 0.012; col = COB;
        al = 0.35 + 0.6 * fract(r2[i] * 9 + t * 0.05 * 9);
      } else {
        const k = fract(r2[i] + t * 0.03) * 3, th = 6.2831853 * k, grow = 1 + 0.18 * k;
        along = (0.66 * Math.sin(th) - 0.35 + 0.28 * k) * grow * 0.8; radial = 0.33 * Math.cos(th) * grow; col = GREY; al = 0.55 * (1 - k / 3 * 0.7);
      }
      o.x = along; o.y = 0; o.z = radial; rotX(o, 1.05); rotY(o, 0.22 * Math.sin(t * 0.18)); o.y += 0.1; setc(col, o); o.a = al;
    },
    protein(i, t, o) {
      const a = r1[i];
      if (a < 0.1) { o.x = -1 + 2 * r2[i]; o.y = 0.66 + 0.055 * Math.sin(12 * o.x - t * 3); o.z = 0; setc(SKY, o); o.a = 0.75; return; }
      let k = Math.floor(r2[i] * NRES), x, y, z;
      if (a < 0.5) { const k2 = Math.min(NRES - 1, k + 1), s = r3[i]; x = beads[k * 3] + (beads[k2 * 3] - beads[k * 3]) * s + g1[i] * 0.004; y = beads[k * 3 + 1] + (beads[k2 * 3 + 1] - beads[k * 3 + 1]) * s + g2[i] * 0.004; z = beads[k * 3 + 2] + (beads[k2 * 3 + 2] - beads[k * 3 + 2]) * s + g3[i] * 0.004; mixc(INK, SLATE, k / NRES, o); o.a = pocket[k] ? 0.9 : 0.55; if (pocket[k]) setc(COB, o); }
      else if (a < 0.56) { const rr = 0.03 + 0.05 * Math.abs(g1[i]), th = 6.283 * r3[i], ph = Math.acos(2 * fract(r3[i] * 9.1) - 1); x = rr * Math.sin(ph) * Math.cos(th); y = rr * Math.sin(ph) * Math.sin(th); z = rr * Math.cos(ph); setc(COB, o); o.a = 0.55 + 0.45 * Math.sin(t * 2 + r3[i] * 6) ** 2; }
      else {
        const jit = pocket[k] ? 0.016 : 0.011; x = beads[k * 3] + g1[i] * jit; y = beads[k * 3 + 1] + g2[i] * jit; z = beads[k * 3 + 2] + g3[i] * jit;
        if (pocket[k]) { setc(COB, o); o.a = 1; } else { mixc(INK, SLATE, k / NRES, o); o.a = 0.8; }
      }
      o.x = x; o.y = y; o.z = z; rotX(o, 0.35); rotY(o, t * 0.16); o.x *= 1.25; o.y = o.y * 1.25 - 0.08;
    },
    spins(i, t, o) {
      const per = 9, L = N > 6000 ? 5 : 4, sites = Math.floor(N / per), side = Math.floor(Math.sqrt(sites / L));
      const s = Math.floor(i / per), k = i % per;
      if (s >= side * side * L) { o.x = o.y = o.z = 0; o.a = 0; setc(INK, o); return; }
      const layer = Math.floor(s / (side * side)), rem = s % (side * side), ix = rem % side, iz = Math.floor(rem / side);
      const X = (ix / (side - 1) - 0.5) * 1.75, Z = (iz / (side - 1) - 0.5) * 0.95, Y = (layer / (L - 1) - 0.5) * 0.95;
      const c = fract(t * 0.16) * 2.6 - 1.3, env = Math.exp(-(((X - c) / 0.38) ** 2));
      const ph = 9 * X - t * 4.5 + (layer % 2) * Math.PI, tilt = 0.95 * env, sg = layer % 2 ? -1 : 1;
      const dx = Math.sin(tilt) * Math.cos(ph), dy = sg * Math.cos(tilt), dz = Math.sin(tilt) * Math.sin(ph), f = (k / (per - 1) - 0.5) * 0.15;
      o.x = X + dx * f; o.y = Y + dy * f; o.z = Z + dz * f;
      rotX(o, 0.5); rotY(o, -0.55 + 0.12 * Math.sin(t * 0.2));
      mixc(INK, COB, Math.min(1, env * 1.3), o); o.a = (k === per - 1 ? 1 : 0.7) * (0.75 + 0.25 * env);
    },
    flakes(i, t, o) {
      const fi = flakeOf[i], scan = (fract(t * 0.09) * 1.45 - 0.2) * 2 - 1;
      if (fi === -2) { o.x = scan; o.z = r2[i] * 1.3 - 0.65; o.y = r3[i] * 0.3; setc(COB, o); o.a = scan > -1.05 && scan < 1.05 ? 0.28 : 0; }
      else if (fi === -1) { o.x = fx[i]; o.z = fz[i]; o.y = 0; setc(GREY, o); o.a = 0.28; }
      else {
        const f = flakes[fi], l = flakeLayer[i]; o.x = fx[i]; o.z = fz[i]; o.y = 0.012 + l * 0.04;
        if (f.layers === 1) { const lit = scan > f.maxx; if (lit) { setc(COB, o); o.a = 0.95; } else { setc(SLATE, o); o.a = 0.5; } }
        else { setc(INK, o); o.a = 0.42 + 0.1 * l; }
      }
      rotX(o, 0.8); rotY(o, 0.32 + 0.08 * Math.sin(t * 0.15)); o.y -= 0.05;
    },
    attractor(i, t, o) {
      const s = fract(r2[i] + t * 0.01) * (MG.n - 1), k = Math.floor(s), f = s - k, c = MG.curve;
      o.x = c[k * 3] + (c[k * 3 + 3] - c[k * 3]) * f + g1[i] * 0.008; o.y = c[k * 3 + 1] + (c[k * 3 + 4] - c[k * 3 + 1]) * f + g2[i] * 0.008; o.z = c[k * 3 + 2] + (c[k * 3 + 5] - c[k * 3 + 2]) * f + g3[i] * 0.008;
      rotX(o, 0.3); rotY(o, 0.6 + t * 0.12);
      const hue = 0.5 + 0.5 * Math.sin((s / MG.n) * 6.2831853 * 5); mixc(COB, VIO, hue, o); o.a = 0.7;
      o.x *= 0.82; o.y = o.y * 0.8 + 0.04; o.z *= 0.82;
    },
    swarm(i, t, o) {
      const a = r1[i];
      const trees = [[-0.7, -0.2], [-0.25, 0.25], [0.15, -0.3], [0.55, 0.2], [0.8, -0.25], [-0.05, 0.02]];
      if (a < 0.38) {
        const [tx, tz] = trees[Math.floor(r2[i] * trees.length)], h = 0.62, y = fract(r3[i] * 3.7) * h, rad = 0.14 * (1 - y / h) * Math.sqrt(fract(r3[i] * 11.3)), ang = 6.2831853 * fract(r2[i] * 17.1);
        o.x = tx + rad * Math.cos(ang); o.z = tz + rad * Math.sin(ang); o.y = -0.42 + y; setc(TEAL, o); o.a = 0.45 + 0.3 * (y / h);
      } else if (a < 0.5) { o.x = r2[i] * 2 - 1; o.z = r3[i] * 1.2 - 0.6; o.y = -0.43; setc(GREY, o); o.a = 0.25; }
      else {
        const d = Math.floor(r2[i] * 5), lag = r3[i] < 0.18 ? 0 : (r3[i] - 0.18) / 0.82 * 0.28, tau = t * 0.55 - lag * 7;
        o.x = 0.85 * Math.sin(0.7 * tau + d * 1.3); o.z = 0.48 * Math.sin(1.1 * tau + 2.1 * d); o.y = 0.06 + 0.14 * Math.sin(0.9 * tau + d * 1.7);
        if (lag === 0) { o.x += g1[i] * 0.018; o.y += g2[i] * 0.012; o.z += g3[i] * 0.018; setc(COB, o); o.a = 1; }
        else { mixc(COB, SKY, lag / 0.28, o); o.a = 0.6 * (1 - lag / 0.28); }
      }
      rotX(o, 0.5); rotY(o, 0.35 + 0.1 * Math.sin(t * 0.15));
    },
  };

  const stages = [...document.querySelectorAll('.stage[data-shape]')].filter((s) => SH[s.dataset.shape]);
  const A = { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0 }, B = { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0 };

  // Fill pos (world), col and alpha. Returns visibility in [0, 1].
  function update(W, H, halfW, halfH, t, pos, col, alpha) {
    if (!stages.length) return 0;
    const vc = H / 2, rects = stages.map((s) => s.getBoundingClientRect());
    const cs = rects.map((r) => r.top + r.height / 2);
    let ia = 0, ib = 0, m = 0, vis = 1;
    const first = cs[0], last = cs[cs.length - 1];
    if (vc <= first) { ia = ib = 0; vis = clamp01(1 - (first - vc - H * 0.45) / (H * 0.4)); }
    else if (vc >= last) { ia = ib = cs.length - 1; vis = clamp01(1 - (vc - last - H * 0.45) / (H * 0.4)); }
    else {
      for (let k = 0; k < cs.length - 1; k++) if (vc >= cs[k] && vc < cs[k + 1]) { ia = k; ib = k + 1; break; }
      const a0 = cs[ia] + rects[ia].height * 0.18, b0 = cs[ib] - rects[ib].height * 0.18;
      m = b0 > a0 ? clamp01((vc - a0) / (b0 - a0)) : vc > cs[ia] ? 1 : 0;
    }
    if (vis <= 0.001) return 0;
    const tf = (r) => ({ cx: ((r.left + r.width / 2) / W * 2 - 1) * halfW, cy: -(((r.top + r.height / 2) / H) * 2 - 1) * halfH, s: (r.width / W) * halfW });
    const TA = tf(rects[ia]), TB = tf(rects[ib]), fa = SH[stages[ia].dataset.shape], fb = SH[stages[ib].dataset.shape];
    const both = ia !== ib && m > 0 && m < 1;
    for (let i = 0; i < N; i++) {
      const w = both ? smooth(clamp01(m * 1.6 - r1[(i * 7) % N] * 0.6)) : m >= 1 ? 1 : 0;
      let x, y, z, cr, cg, cb, al;
      if (w < 1 || !both) {
        fa(i, t, A); x = TA.cx + A.x * TA.s; y = TA.cy + A.y * TA.s; z = A.z * TA.s; cr = A.r; cg = A.g; cb = A.b; al = A.a;
        if (!both && m >= 1) { fb(i, t, B); x = TB.cx + B.x * TB.s; y = TB.cy + B.y * TB.s; z = B.z * TB.s; cr = B.r; cg = B.g; cb = B.b; al = B.a; }
      }
      if (both && w > 0) {
        fb(i, t, B);
        const bx = TB.cx + B.x * TB.s, by = TB.cy + B.y * TB.s, bz = B.z * TB.s;
        if (w >= 1) { x = bx; y = by; z = bz; cr = B.r; cg = B.g; cb = B.b; al = B.a; }
        else {
          const arc = Math.sin(w * Math.PI) * 0.35 * (g1[i] > 0 ? 1 : -1); // particles swirl a little in flight
          x = x + (bx - x) * w + arc * 0.4; y = y + (by - y) * w; z = z + (bz - z) * w + arc;
          cr = cr + (B.r - cr) * w; cg = cg + (B.g - cg) * w; cb = cb + (B.b - cb) * w; al = Math.max(0.35, al + (B.a - al) * w);
        }
      }
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      col[i * 3] = cr; col[i * 3 + 1] = cg; col[i * 3 + 2] = cb; alpha[i] = al;
    }
    return vis;
  }
  return { update, count: stages.length };
}
