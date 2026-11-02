/* Figs. 7–11. Each figure uses its own medium: an illustrated SVG story (7), a magnet you can
   poke (8), a microscope you can drag (9), a live echo state network (10) and an orchard survey (11).
   Every figure animates only while it is on screen and draws a still frame under reduced motion. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasST = !!(window.gsap && window.ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, t) => a + (b - a) * t;
  function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  const COB = '#2B3FE0', INK = '#1D2330', SLATE = '#576072', RULE = '#C7CCD5', PAPER = '#F6F7F9', TEAL = '#0F7A84', SKY = '#3B8EE0';

  // Canvas helper: sizes to its CSS box, runs draw(dt, t) only while visible.
  function stage(canvas, aspect, draw) {
    const ctx = canvas.getContext('2d'); let W = 0, H = 0, dpr = 1, raf = 0, last = 0, T = 0;
    const fit = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); W = canvas.clientWidth; H = Math.round(W / aspect); canvas.style.height = H + 'px'; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const api = { ctx, get W() { return W; }, get H() { return H; }, redraw: () => draw(0, T) };
    const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; T += dt; draw(dt, T); raf = requestAnimationFrame(loop); };
    let lw = canvas.clientWidth;
    new ResizeObserver(() => { if (Math.abs(canvas.clientWidth - lw) < 2) return; lw = canvas.clientWidth; fit(); draw(0, T); }).observe(canvas.parentElement);
    if (reduce) { requestAnimationFrame(() => draw(0, 0)); return api; }
    new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf = 0; } }), { threshold: 0.02 }).observe(canvas);
    requestAnimationFrame(() => draw(0, 0));
    return api;
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }

  /* ================= Fig. 7: radio wave → cell → protein pocket ================= */
  (function () {
    const svg = $('#fig7'); if (!svg) return;
    const cx = 320, cy = 245, f = (v) => v.toFixed(1);
    // A protein ribbon cartoon, drawn for illustration: three coiled helices, a three-strand sheet, loops.
    const helix = (P0, P1, turns, r) => {
      const dx = P1[0] - P0[0], dy = P1[1] - P0[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, vx = -uy, vy = ux;
      const n = Math.round(turns * 28), pts = [];
      for (let i = 0; i <= n; i++) { const sN = i / n, th = sN * turns * Math.PI * 2, along = sN * L + 0.55 * r * Math.sin(th), side = r * Math.cos(th); pts.push([P0[0] + ux * along + vx * side, P0[1] + uy * along + vy * side, Math.sin(th)]); }
      const back = [], front = []; let cur = [pts[0]], isF = pts[0][2] > 0;
      for (let i = 1; i < pts.length; i++) { const fNow = pts[i][2] > 0; cur.push(pts[i]); if (fNow !== isF) { (isF ? front : back).push(cur); cur = [pts[i]]; isF = fNow; } }
      (isF ? front : back).push(cur);
      const d = (seg) => 'M' + seg.map((q) => f(q[0]) + ' ' + f(q[1])).join(' L');
      return { start: pts[0], end: pts[pts.length - 1], back: back.map(d), front: front.map(d) };
    };
    const strand = (x0, x1, y) => { const dir = Math.sign(x1 - x0), hb = 9, hh = 17, hl = 26, xh = x1 - dir * hl;
      return { start: [x0, y], end: [x1, y], d: `M${x0} ${y - hb} L${xh} ${y - hb} L${xh} ${y - hh} L${x1} ${y} L${xh} ${y + hh} L${xh} ${y + hb} L${x0} ${y + hb} Z` }; };
    const H1 = helix([132, 372], [152, 152], 4.5, 17), H2 = helix([206, 96], [432, 88], 6, 17), H3 = helix([522, 122], [540, 330], 5, 17);
    const S1 = strand(470, 248, 416), S2 = strand(234, 456, 380), S3 = strand(466, 262, 344);
    const loop = (a, b, c1, c2) => `M${f(a[0])} ${f(a[1])} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${f(b[0])} ${f(b[1])}`;
    const loops = [
      loop([92, 432], H1.start, [100, 410], [120, 392]),
      loop(H1.end, H2.start, [158, 112], [180, 92]),
      loop(H2.end, H3.start, [470, 82], [520, 92]),
      loop(H3.end, S1.start, [548, 380], [520, 416]),
      loop(S1.end, S2.start, [214, 416], [210, 380]),
      loop(S2.end, S3.start, [486, 380], [490, 344]),
      loop(S3.end, [206, 292], [226, 344], [206, 322]),
    ];
    const sheetBonds = [[300, 416, 380], [360, 416, 380], [420, 416, 380], [300, 380, 344], [360, 380, 344], [420, 380, 344]];
    const cartoon = `
      <g class="f7-loops">${loops.map((d) => `<path d="${d}"/>`).join('')}</g>
      <g class="f7-hb">${sheetBonds.map(([x, y1, y2]) => `<path d="M${x} ${y1 - 10} V${y2 + 10}"/>`).join('')}</g>
      <g class="f7-hx-back">${[H1, H2, H3].flatMap((h) => h.back).map((d) => `<path d="${d}"/>`).join('')}</g>
      <g class="f7-sheet">${[S1, S2, S3].map((t) => `<path d="${t.d}"/>`).join('')}</g>
      <g class="f7-hx-front">${[H1, H2, H3].flatMap((h) => h.front).map((d) => `<path d="${d}"/><path class="hi" d="${d}"/>`).join('')}</g>`;
    // 12 residues line the pocket; each side chain reaches in toward FAD
    const pcx = cx, pcy = cy + 4, prx = 82, pry = 66;
    const res = Array.from({ length: 12 }, (_, i) => { const a = -Math.PI / 2 + (i / 12) * Math.PI * 2 + (i % 2 ? 0.08 : -0.05); const x = pcx + prx * Math.cos(a), y = pcy + pry * Math.sin(a); return [x, y, x - 13 * Math.cos(a), y - 11 * Math.sin(a)]; });
    const hex = (x, y, r) => { let d = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; d += (k ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1); } return d + 'Z'; };
    const blobs = [[200, 360], [250, 200], [520, 330], [560, 220], [430, 400], [300, 420], [180, 260], [500, 150]];
    let wave = ''; for (let i = 0; i <= 60; i++) { const sN = i / 60, x = 100 + sN * 360, y = 76 + sN * 150 + Math.sin(sN * 26) * 9; wave += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    svg.innerHTML = `
      <defs><radialGradient id="f7glow"><stop offset="0" stop-color="${COB}" stop-opacity=".3"/><stop offset="1" stop-color="${COB}" stop-opacity="0"/></radialGradient></defs>
      <g id="f7-cell">
        <ellipse cx="380" cy="285" rx="228" ry="168" fill="#EEF1F6" stroke="${RULE}" stroke-width="2.5"/>
        <ellipse cx="380" cy="285" rx="218" ry="158" fill="none" stroke="${RULE}" stroke-width="1" stroke-dasharray="2 5"/>
        <ellipse cx="330" cy="310" rx="64" ry="52" fill="#E1E5EC"/><text x="330" y="314" class="f7-l" text-anchor="middle">nucleus</text>
        ${blobs.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${14 + (i % 3) * 4}" ry="${10 + (i % 2) * 4}" fill="#D6DBE3" transform="rotate(${i * 37} ${x} ${y})"/>`).join('')}
        <g class="f7-target"><circle cx="462" cy="250" r="34" fill="url(#f7glow)"/><g class="f7-mini" transform="translate(462 250) scale(.12) translate(-${cx} -${cy + 15})">${cartoon}</g></g>
        <text x="500" y="244" class="f7-l ink">flavoprotein</text>
        <text x="380" y="472" class="f7-l" text-anchor="middle">HT-1080 cell</text>
        <path class="f7-wave" d="${wave}" fill="none" stroke="${SKY}" stroke-width="2.5" stroke-linecap="round"/>
        <g transform="translate(70 70)"><path d="M0 -26 L0 40 M-14 40 L0 -6 L14 40 M-9 22 L9 22" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cy="-28" r="4.5" fill="${INK}"/>
          ${[16, 28, 40].map((r, i) => `<path class="f7-ping" style="animation-delay:${i * 0.35}s" d="M${(r * 0.7).toFixed(1)} ${(-28 - r * 0.7).toFixed(1)} A${r} ${r} 0 0 1 ${(r * 0.7).toFixed(1)} ${(-28 + r * 0.7).toFixed(1)}" stroke="${SKY}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}</g>
        <text x="40" y="136" class="f7-l">Weak RF field</text><text x="40" y="152" class="f7-l">20 nT, 2–5 MHz</text>
      </g>
      <g id="f7-prot">
        <ellipse class="f7-pocket" cx="${pcx}" cy="${pcy}" rx="${prx - 8}" ry="${pry - 8}"/>
        <circle cx="${cx}" cy="${cy}" r="60" fill="url(#f7glow)"/>
        ${cartoon}
        <g class="f7-res">${res.map(([x, y, ix, iy], i) => `<g data-k="${i}"><path d="M${f(x)} ${f(y)} L${f(ix)} ${f(iy)}"/><circle cx="${f(x)}" cy="${f(y)}" r="7"/></g>`).join('')}</g>
        <g class="f7-fad"><path d="${hex(cx - 21, cy, 12)}"/><path d="${hex(cx, cy, 12)}"/><path d="${hex(cx + 21, cy, 12)}"/></g>
        <g class="f7-pair"><g transform="translate(${cx - 16} ${cy - 30})"><circle r="6"/><path class="f7-spin a" d="M0 8 L0 -10 M-4 -5 L0 -10 L4 -5"/></g><g transform="translate(${cx + 16} ${cy - 30})"><circle r="6"/><path class="f7-spin b" d="M0 8 L0 -10 M-4 -5 L0 -10 L4 -5"/></g></g>
        <text x="${cx}" y="${cy + 34}" class="f7-l ink" text-anchor="middle">FAD</text>
        <path d="M${cx + 24} ${cy - 38} L398 186" class="f7-lead"/><text x="402" y="182" class="f7-l">radical pair</text>
        <text x="320" y="62" class="f7-l" text-anchor="middle">helix</text>
        <text x="510" y="420" class="f7-l">sheet</text>
        <text x="${cx}" y="468" class="f7-count" text-anchor="middle"><tspan id="f7-n">12</tspan> of 326 interior residues shield the site</text>
      </g>`;
    const cell = $('#f7-cell'), prot = $('#f7-prot'), n = $('#f7-n');
    const pocket = [...svg.querySelectorAll('.f7-res g')];
    const steps = [...document.querySelectorAll('#fig7-steps li')];
    function set(p) {
      const z = ease(clamp((p - 0.3) / 0.26));
      cell.setAttribute('transform', `translate(462 250) scale(${1 + 2.6 * z}) translate(-462 -250)`);
      cell.style.opacity = 1 - clamp((p - 0.36) / 0.18);
      const o = clamp((p - 0.42) / 0.16);
      prot.style.opacity = o; prot.setAttribute('transform', `translate(${cx} ${cy}) scale(${0.65 + 0.35 * ease(o)}) translate(-${cx} -${cy})`);
      const k = Math.round(clamp((p - 0.6) / 0.3) * 12);
      pocket.forEach((b, i) => b.classList.toggle('on', i < k)); n.textContent = k;
      const s = p < 0.34 ? 0 : p < 0.6 ? 1 : 2; steps.forEach((li, i) => li.classList.toggle('is-active', i === s));
    }
    if (hasST && !reduce) ScrollTrigger.create({ trigger: svg, start: 'top 72%', end: 'bottom 40%', scrub: 0.5, onUpdate: (s) => set(s.progress), onRefresh: (s) => set(s.progress) });
    else set(1);
  })();

  /* ================= Fig. 8: poke the magnet, read off the wave ================= */
  (function () {
    const cv = $('#fig8'); if (!cv) return;
    const fitCv = $('#fig8-fit'), fitCtx = fitCv.getContext('2d'), vOut = $('#fig8-v'), hint = $('#fig8-hint');
    const COLS = 16, ROWS = 6, V = 3.2, WID = 1.25;
    const waves = []; let idle = 2.2, interacted = false, samples = [];
    const geo = (W, H) => ({ x0: W * 0.08, y0: H * 0.86, dx: W * 0.047, rx: W * 0.021, ry: H * 0.052, gap: H * 0.34, L: H * 0.1 });
    function site(g, i, j, layer) { return [g.x0 + i * g.dx + j * g.rx, g.y0 - j * g.ry - layer * g.gap]; }
    function launch(i, j, t) { waves.push({ i, j, t0: t }); if (waves.length > 4) waves.shift(); samples = []; }
    let T = 0;
    const st = stage(cv, 16 / 10, (dt, t) => {
      T = t; const { ctx, W, H } = st; const g = geo(W, H);
      ctx.clearRect(0, 0, W, H);
      // auto-launch until the visitor taps
      idle -= dt; if (idle <= 0 && !reduce) { idle = interacted ? 6 : 3.4; if (!interacted || waves.length === 0) launch(2 + Math.floor(Math.random() * 12), Math.floor(Math.random() * ROWS), t); }
      if (reduce && !waves.length) waves.push({ i: 6, j: 2, t0: -1.1 });
      // layer sheets
      [0, 1].forEach((layer) => {
        const a = site(g, -0.6, -0.6, layer), b = site(g, COLS - 0.4, -0.6, layer), c = site(g, COLS - 0.4, ROWS - 0.4, layer), d = site(g, -0.6, ROWS - 0.4, layer);
        ctx.fillStyle = layer ? 'rgba(43,63,224,.06)' : 'rgba(15,122,132,.07)'; ctx.strokeStyle = layer ? 'rgba(43,63,224,.35)' : 'rgba(15,122,132,.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      // legend, top right, above the back row of spins
      const fs = W < 520 ? 11 : 12.5, lx = W - 14, ly = W < 520 ? 14 : 22;
      ctx.font = `500 ${fs}px "Schibsted Grotesk", Arial, sans-serif`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [['Top layer: spins point up', COB], ['Bottom layer: spins point down', TEAL]].forEach(([s, c], k) => {
        const y = ly + k * (fs + 6); ctx.fillStyle = SLATE; ctx.fillText(s, lx, y);
        const tw = ctx.measureText(s).width; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(lx - tw - 9, y, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      // spins, back rows first, bottom layer first
      for (const layer of [0, 1]) for (let j = ROWS - 1; j >= 0; j--) for (let i = 0; i < COLS; i++) {
        let th = 0;
        for (const w of waves) { const tau = t - w.t0; if (tau < 0) continue; const r = Math.hypot(i - w.i, (j - w.j) * 1.4); th += 1.05 * Math.exp(-0.32 * tau) * Math.exp(-(((r - V * tau) / WID) ** 2)); }
        th = Math.min(th, 1.2);
        const ph = t * 7 + (i + j) * 0.4 + layer * Math.PI, up = layer ? -1 : 1, [x, y] = site(g, i, j, layer);
        const tx = x + Math.sin(th) * Math.cos(ph) * g.L, ty = y + up * Math.cos(th) * g.L + Math.sin(th) * Math.sin(ph) * g.L * 0.3;
        const base = layer ? COB : TEAL;
        ctx.strokeStyle = base; ctx.globalAlpha = 0.5 + 0.5 * Math.min(1, th * 2); ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = th > 0.15 ? (layer ? '#5B6CFF' : '#20A9B5') : base;
        ctx.beginPath(); ctx.arc(tx, ty, 3.4 + th * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(29,35,48,.25)'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      // wavefront ring for the newest wave, on the top layer
      const w = waves[waves.length - 1];
      if (w) {
        const tau = t - w.t0, r = V * tau;
        if (tau > 0 && tau < 4) {
          ctx.strokeStyle = `rgba(43,63,224,${0.45 * Math.exp(-0.5 * tau)})`; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
          const [ox, oy] = site(g, w.i, w.j, 1); ctx.beginPath(); ctx.ellipse(ox, oy, r * g.dx, r * g.dx * 0.42, -0.35, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
          if (!reduce && (!samples.length || tau - samples[samples.length - 1][0] > 0.12)) samples.push([tau, r + (Math.random() - 0.5) * 0.5]);
        }
      }
      drawFit();
    });
    function drawFit() {
      const w = fitCv.clientWidth, h = fitCv.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (fitCv.width !== Math.round(w * dpr)) { fitCv.width = Math.round(w * dpr); fitCv.height = Math.round(h * dpr); }
      const c = fitCtx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      const px = (x) => 30 + (x / 4) * (w - 40), py = (y) => h - 22 - (y / 13) * (h - 34);
      c.strokeStyle = RULE; c.lineWidth = 1; c.beginPath(); c.moveTo(30, 8); c.lineTo(30, h - 22); c.lineTo(w - 8, h - 22); c.stroke();
      c.font = '500 11px "Schibsted Grotesk", Arial, sans-serif'; c.fillStyle = SLATE; c.fillText('time', w - 36, h - 8); c.save(); c.translate(12, h / 2 + 22); c.rotate(-Math.PI / 2); c.fillText('front', 0, 0); c.restore();
      const pts = reduce ? Array.from({ length: 24 }, (_, k) => [k * 0.15, V * k * 0.15]) : samples;
      c.fillStyle = SLATE; pts.forEach(([x, y]) => { c.beginPath(); c.arc(px(x), py(y), 2.6, 0, Math.PI * 2); c.fill(); });
      if (pts.length > 3) {
        let sx = 0, sy = 0, sxx = 0, sxy = 0; pts.forEach(([x, y]) => { sx += x; sy += y; sxx += x * x; sxy += x * y; });
        const nn = pts.length, m = (nn * sxy - sx * sy) / (nn * sxx - sx * sx), b = (sy - m * sx) / nn;
        c.strokeStyle = COB; c.lineWidth = 2; c.beginPath(); c.moveTo(px(0), py(b)); c.lineTo(px(4), py(b + m * 4)); c.stroke();
        vOut.textContent = m.toFixed(1);
      }
    }
    cv.addEventListener('pointerdown', (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, g = geo(st.W, st.H);
      let best = null, bd = 1e9;
      for (const layer of [0, 1]) for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) { const [sx, sy] = site(g, i, j, layer); const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = [i, j]; } }
      if (best && bd < g.dx * 3) { interacted = true; idle = 6; launch(best[0], best[1], T); hint.classList.add('gone'); if (reduce) st.redraw(); }
    });
  })();

  /* ================= Fig. 9: a microscope you can drag ================= */
  (function () {
    const cv = $('#fig9'); if (!cv) return;
    const found = $('#fig9-found'), totalEl = $('#fig9-total'), hint = $('#fig9-hint');
    const R = seeded(19), WW = 1900, WH = 1200, flakes = [];
    for (let k = 0; k < 46; k++) {
      const r = 30 + R() * 60, x = R() * WW, y = R() * WH, n = 6 + Math.floor(R() * 4), rot = R() * 6.28, st = 0.6 + R() * 0.9, pts = [];
      for (let j = 0; j < n; j++) { const a = rot + (j / n) * 6.283 + (R() - 0.5) * 0.5, rad = r * (0.6 + R() * 0.55); pts.push([Math.cos(a) * rad * st, Math.sin(a) * rad]); }
      const q = R(), layers = q < 0.3 ? 1 : q < 0.5 ? 2 : q < 0.68 ? 3 + Math.floor(R() * 2) : 5 + Math.floor(R() * 5);
      flakes.push({ id: k, x, y, pts, layers, bx: Math.max(...pts.map((p) => Math.abs(p[0]))), by: Math.max(...pts.map((p) => Math.abs(p[1]))) });
    }
    const mono = flakes.filter((f) => f.layers === 1).length; totalEl.textContent = mono;
    const colorOf = (L) => (L === 1 ? 'rgba(78,54,156,.34)' : L === 2 ? 'rgba(92,70,168,.55)' : L <= 4 ? 'rgba(96,110,196,.82)' : L <= 6 ? 'rgba(122,186,170,.92)' : 'rgba(214,201,128,.95)');
    const speck = (() => { const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d'); const RR = seeded(4); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(255,255,255,${RR() * 0.08})`; x.fillRect(RR() * 160, RR() * 160, 1.2, 1.2); } return c; })();
    let ox = 900, oy = 560, vx = 22, vy = 9, drag = null, idleT = 0, sweep = 0, passed = new Set(), seen = new Set();
    const wrap = (d, m) => ((d % m) + m * 1.5) % m - m / 2;
    const st = stage(cv, 16 / 10, (dt, t) => {
      const { ctx, W, H } = st; const k = W / 820, cx = W / 2, cy = H / 2, ra = Math.min(W, H) * 0.47;
      if (!drag && !reduce) { idleT += dt; if (idleT > 1.2) { ox += vx * dt; oy += vy * dt * Math.sin(t * 0.3); } }
      sweep += dt / 2.8; if (sweep > 1.25) { sweep = 0; passed = new Set(); }
      ctx.fillStyle = '#0B1020'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, ra, 0, Math.PI * 2); ctx.clip();
      const sub = ctx.createRadialGradient(cx, cy, ra * 0.1, cx, cy, ra); sub.addColorStop(0, '#AE9FD8'); sub.addColorStop(1, '#8676BA'); ctx.fillStyle = sub; ctx.fillRect(cx - ra, cy - ra, ra * 2, ra * 2);
      ctx.globalAlpha = 0.9; ctx.fillStyle = ctx.createPattern(speck, 'repeat'); ctx.fillRect(cx - ra, cy - ra, ra * 2, ra * 2); ctx.globalAlpha = 1;
      const scanX = cx - ra + sweep * ra * 2;
      const vis = [];
      flakes.forEach((f) => {
        const sx = cx + wrap(f.x - ox, WW) * k, sy = cy + wrap(f.y - oy, WH) * k;
        if (sx < cx - ra - 120 * k || sx > cx + ra + 120 * k || sy < cy - ra - 120 * k || sy > cy + ra + 120 * k) return;
        ctx.fillStyle = colorOf(f.layers); ctx.strokeStyle = 'rgba(40,30,80,.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); f.pts.forEach(([px, py], i) => (i ? ctx.lineTo(sx + px * k, sy + py * k) : ctx.moveTo(sx + px * k, sy + py * k))); ctx.closePath(); ctx.fill(); ctx.stroke();
        vis.push([f, sx, sy]);
        if (sx + f.bx * k < scanX && Math.hypot(sx - cx, sy - cy) < ra) passed.add(f.id);
      });
      // detections
      ctx.font = `600 ${Math.max(10, 11 * k)}px "Schibsted Grotesk", Arial, sans-serif`;
      vis.forEach(([f, sx, sy]) => {
        const isMono = f.layers === 1;
        if (!(passed.has(f.id) || (isMono && seen.has(f.id)) || reduce)) return;
        if (isMono && !seen.has(f.id) && Math.hypot(sx - cx, sy - cy) < ra * 0.95) { seen.add(f.id); found.textContent = seen.size; }
        const w = f.bx * k + 6, h = f.by * k + 6;
        ctx.strokeStyle = isMono ? '#3550FF' : 'rgba(255,255,255,.55)'; ctx.lineWidth = isMono ? 2 : 1; ctx.setLineDash(isMono ? [] : [3, 3]);
        ctx.strokeRect(sx - w, sy - h, w * 2, h * 2); ctx.setLineDash([]);
        const label = isMono ? 'Monolayer' : f.layers + ' layers', tw = ctx.measureText(label).width + 10;
        ctx.fillStyle = isMono ? '#3550FF' : 'rgba(11,16,32,.55)'; ctx.fillRect(sx - w, sy - h - 17, tw, 16);
        ctx.fillStyle = '#fff'; ctx.fillText(label, sx - w + 5, sy - h - 5);
      });
      if (!reduce && sweep < 1) { const gr = ctx.createLinearGradient(scanX - 70, 0, scanX, 0); gr.addColorStop(0, 'rgba(80,100,255,0)'); gr.addColorStop(1, 'rgba(80,100,255,.22)'); ctx.fillStyle = gr; ctx.fillRect(scanX - 70, cy - ra, 70, ra * 2); ctx.fillStyle = '#5B6CFF'; ctx.fillRect(scanX - 1, cy - ra, 2, ra * 2); }
      // reticle and scale bar
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillRect(cx + ra * 0.38, cy + ra * 0.72, 50 * k, 3); ctx.font = `500 ${Math.max(10, 11 * k)}px "Schibsted Grotesk", Arial, sans-serif`; ctx.fillText('10 µm', cx + ra * 0.38, cy + ra * 0.72 - 6);
      ctx.restore();
      // lens rim
      const rim = ctx.createRadialGradient(cx, cy, ra * 0.85, cx, cy, ra); rim.addColorStop(0, 'rgba(11,16,32,0)'); rim.addColorStop(1, 'rgba(11,16,32,.85)'); ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, ra, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2A3350'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, ra + 3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#8FA0D8'; ctx.font = '600 12px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillText('MONOSCAN', 18, 26); ctx.fillStyle = '#5A668C'; ctx.font = '500 11px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillText('WSe₂ on SiO₂, 100×', 18, 42);
      if (W >= 520) {
        // left: detection log
        ctx.font = '600 11px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillStyle = '#8FA0D8'; ctx.fillText('Detections', 18, cy - 34);
        const log = [...seen].slice(-4).reverse();
        ctx.font = '500 11px "Schibsted Grotesk", Arial, sans-serif';
        if (!log.length) { ctx.fillStyle = '#5A668C'; ctx.fillText('Scanning…', 18, cy - 14); }
        log.forEach((id, i) => { const y = cy - 14 + i * 19; ctx.globalAlpha = 1 - i * 0.2; ctx.fillStyle = '#3550FF'; rr(ctx, 18, y - 9, 10, 10, 2); ctx.fill(); ctx.fillStyle = '#DCE2F5'; ctx.fillText('Flake ' + String(id + 1).padStart(2, '0') + ', 1 layer', 34, y); ctx.globalAlpha = 1; });
        // right: what each color means
        const kx = cx + ra + 22, ky = cy - 58;
        ctx.font = '600 11px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillStyle = '#8FA0D8'; ctx.fillText('Layer count', kx, ky - 14);
        ctx.font = '500 11px "Schibsted Grotesk", Arial, sans-serif';
        [[1, '1 (the target)'], [2, '2'], [3, '3 to 4'], [5, '5 to 6'], [8, '7 or more']].forEach(([L, s], i) => {
          const y = ky + i * 24; ctx.fillStyle = '#9C8DCB'; rr(ctx, kx, y - 2, 16, 16, 3); ctx.fill(); ctx.fillStyle = colorOf(L); rr(ctx, kx, y - 2, 16, 16, 3); ctx.fill();
          if (L === 1) { ctx.strokeStyle = '#3550FF'; ctx.lineWidth = 1.5; rr(ctx, kx - 2, y - 4, 20, 20, 4); ctx.stroke(); }
          ctx.fillStyle = L === 1 ? '#DCE2F5' : '#A9B3D6'; ctx.fillText(s, kx + 26, y + 10);
        });
      }
    });
    cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, ox, oy }; cv.setPointerCapture(e.pointerId); cv.classList.add('dragging'); hint.classList.add('gone'); });
    cv.addEventListener('pointermove', (e) => { if (!drag) return; const k = st.W / 820; ox = drag.ox - (e.clientX - drag.x) / k; oy = drag.oy - (e.clientY - drag.y) / k; if (reduce) st.redraw(); });
    const up = () => { drag = null; idleT = 0; cv.classList.remove('dragging'); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  })();

  /* ================= Fig. 10: a live echo state network ================= */
  (function () {
    const cv = $('#fig10'); if (!cv) return;
    const errOut = $('#fig10-err');
    // Mackey-Glass, sampled once per time unit
    const tau = 17, dt = 0.1, lagN = Math.round(tau / dt), steps = 80000, xs = new Float32Array(steps);
    for (let i = 0; i <= lagN; i++) xs[i] = 1.2;
    for (let i = lagN + 1; i < steps; i++) { const xd = xs[i - 1 - lagN]; xs[i] = xs[i - 1] + dt * ((0.2 * xd) / (1 + xd ** 10) - 0.1 * xs[i - 1]); }
    const U = []; for (let i = 20000; i < steps; i += 10) U.push((xs[i] - 0.92) * 2.2);
    // Echo state network: 16 leaky tanh nodes, sparse random coupling, ridge readout
    const N = 16, R = seeded(11), Wr = Array.from({ length: N }, () => new Float32Array(N)), Win = new Float32Array(N), edges = [];
    for (let i = 0; i < N; i++) { Win[i] = (R() - 0.5) * 1.6; for (let c = 0; c < 3; c++) { const j = Math.floor(R() * N); if (j !== i) { Wr[i][j] = (R() - 0.5) * 2; edges.push([j, i]); } } }
    for (let i = 0; i < N; i++) { const s = Wr[i].reduce((a, b) => a + Math.abs(b), 0) || 1; for (let j = 0; j < N; j++) Wr[i][j] *= 0.92 / Math.max(1, s); }
    const leak = 0.55;
    const stepR = (x, u) => { const y = new Float32Array(N); for (let i = 0; i < N; i++) { let s = Win[i] * u; for (let j = 0; j < N; j++) s += Wr[i][j] * x[j]; y[i] = (1 - leak) * x[i] + leak * Math.tanh(s); } return y; };
    let x = new Float32Array(N); const X = [], Y = [];
    for (let t = 0; t < 1600; t++) { x = stepR(x, U[t]); if (t > 100) { X.push([...x, 1]); Y.push(U[t + 1]); } }
    const D = N + 1, A = Array.from({ length: D }, () => new Float64Array(D + 1));
    X.forEach((r, n) => { for (let i = 0; i < D; i++) { for (let j = 0; j < D; j++) A[i][j] += r[i] * r[j]; A[i][D] += r[i] * Y[n]; } });
    for (let i = 0; i < D; i++) A[i][i] += 1e-5;
    for (let i = 0; i < D; i++) { let p = i; for (let r = i + 1; r < D; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r; [A[i], A[p]] = [A[p], A[i]]; for (let r = 0; r < D; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let c = i; c <= D; c++) A[r][c] -= f * A[i][c]; } }
    const wout = A.map((r, i) => r[D] / r[i]);
    // node layout and live state
    const R2 = seeded(5), nodes = Array.from({ length: N }, (_, i) => { const ring = i < 10 ? 0 : i < 15 ? 1 : 2, k = ring === 0 ? i : i - 10, cnt = ring === 0 ? 10 : 5, a = (k / cnt) * Math.PI * 2 + (ring === 1 ? 0.6 : 0) + (R2() - 0.5) * 0.18, rad = ring === 0 ? 0.4 : ring === 1 ? 0.2 : 0; return { x: 0.5 + Math.cos(a) * rad, y: 0.5 + Math.sin(a) * rad * 0.98, ph: R2() * 6.28 }; });
    let t = 1700, acc = 0, inHist = [], tgHist = [], prHist = [], pulses = [];
    x = new Float32Array(N); for (let k = 1500; k < t; k++) x = stepR(x, U[k]);
    const WIN = 150;
    function advance() {
      x = stepR(x, U[t]); let pred = wout[N]; for (let i = 0; i < N; i++) pred += wout[i] * x[i];
      inHist.push(U[t]); tgHist.push(U[t + 1]); prHist.push(pred); if (inHist.length > WIN) { inHist.shift(); tgHist.shift(); prHist.shift(); }
      t++; if (t > U.length - 3) t = 1700;
      if (!reduce) { for (let k = 0; k < 2; k++) pulses.push({ kind: 'in', to: Math.floor(Math.random() * N), s: 0 }); pulses.push({ kind: 'out', from: Math.floor(Math.random() * N), s: 0 }); const e = edges[Math.floor(Math.random() * edges.length)]; pulses.push({ kind: 'edge', e, s: 0 }); }
    }
    for (let k = 0; k < WIN; k++) advance();
    function scope(ctx, x0, y0, w, h, title, lines) {
      ctx.fillStyle = '#0E1424'; rr(ctx, x0, y0, w, h, 12); ctx.fill();
      ctx.strokeStyle = 'rgba(143,160,216,.12)'; ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x0, y0 + (h * i) / 4); ctx.lineTo(x0 + w, y0 + (h * i) / 4); ctx.stroke(); }
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x0 + (w * i) / 6, y0); ctx.lineTo(x0 + (w * i) / 6, y0 + h); ctx.stroke(); }
      ctx.fillStyle = '#8FA0D8'; ctx.font = `600 ${w < 140 ? 10.5 : 12}px "Schibsted Grotesk", Arial, sans-serif`; ctx.fillText(title, x0 + (w < 140 ? 8 : 12), y0 + (w < 140 ? 16 : 20));
      lines.forEach(({ data, color, width, dash }) => {
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath();
        data.forEach((v, i) => { const px = x0 + 10 + (i / (WIN - 1)) * (w - 20), py = y0 + h * 0.55 - v * h * 0.32; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
        ctx.stroke(); ctx.setLineDash([]);
      });
    }
    const st = stage(cv, 16 / 8.2, (dtt, time) => {
      const { ctx, W, H } = st;
      acc += dtt; while (acc > 0.05) { acc -= 0.05; advance(); }
      ctx.clearRect(0, 0, W, H);
      const sw = W * 0.25, sh = H * 0.62, sy = H * 0.19, inX = W * 0.01, outX = W * 0.74, rx0 = W * 0.29, rw = W * 0.42;
      scope(ctx, inX, sy, sw, sh, 'Input', [{ data: inHist, color: '#9AA8FF', width: 2 }]);
      scope(ctx, outX, sy, sw, sh, 'Prediction', [{ data: tgHist, color: 'rgba(200,208,224,.45)', width: 4 }, { data: prHist, color: '#5B6CFF', width: 2, dash: [5, 3] }]);
      const P = (n) => [rx0 + n.x * rw, sy + n.y * sh], nr = clamp(W * 0.016, 6.5, 11);
      // edges
      ctx.strokeStyle = 'rgba(87,96,114,.22)'; ctx.lineWidth = 1;
      edges.forEach(([a, b]) => { const [x1, y1] = P(nodes[a]), [x2, y2] = P(nodes[b]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
      // pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.s += dtt / 0.45; if (p.s >= 1) { pulses.splice(k, 1); continue; }
        let a, b; if (p.kind === 'in') { a = [inX + sw, sy + sh * 0.55]; b = P(nodes[p.to]); } else if (p.kind === 'out') { a = P(nodes[p.from]); b = [outX, sy + sh * 0.55]; } else { a = P(nodes[p.e[0]]); b = P(nodes[p.e[1]]); }
        const e = p.s; ctx.fillStyle = p.kind === 'edge' ? 'rgba(43,63,224,.55)' : COB; ctx.beginPath(); ctx.arc(lerp(a[0], b[0], e), lerp(a[1], b[1], e), p.kind === 'edge' ? 2 : 2.6, 0, Math.PI * 2); ctx.fill();
      }
      // nodes: spinning needles, brightness = state
      nodes.forEach((n, i) => {
        const [px, py] = P(n), a = Math.min(1, Math.abs(x[i]) * 1.4); n.ph += dtt * (2 + 5 * a);
        ctx.fillStyle = `rgba(43,63,224,${0.1 + 0.55 * a})`; ctx.beginPath(); ctx.arc(px, py, nr * 1.3 + a * nr * 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PAPER; ctx.strokeStyle = COB; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, nr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const nl = nr * 0.7; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - Math.cos(n.ph) * nl, py - Math.sin(n.ph) * nl); ctx.lineTo(px + Math.cos(n.ph) * nl, py + Math.sin(n.ph) * nl); ctx.stroke();
        ctx.fillStyle = COB; ctx.beginPath(); ctx.arc(px + Math.cos(n.ph) * nl, py + Math.sin(n.ph) * nl, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = SLATE; ctx.font = '600 12px "Schibsted Grotesk", Arial, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Reservoir: 16 coupled oscillators', rx0 + rw / 2, sy - 10); ctx.textAlign = 'left';
      if (sw >= 140) { ctx.font = '500 11.5px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillStyle = 'rgba(200,208,224,.8)'; ctx.fillText('target', outX + 12, sy + sh - 12); ctx.fillStyle = '#7F8CFF'; ctx.fillText('prediction', outX + 60, sy + sh - 12); }
      else { ctx.font = '500 10px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillStyle = 'rgba(200,208,224,.8)'; ctx.fillText('target', outX + 8, sy + sh - 20); ctx.fillStyle = '#7F8CFF'; ctx.fillText('prediction', outX + 8, sy + sh - 8); }
      // live error
      let se = 0, sv = 0, m = 0; tgHist.forEach((v) => (m += v)); m /= tgHist.length; tgHist.forEach((v, i) => { se += (v - prHist[i]) ** 2; sv += (v - m) ** 2; });
      errOut.textContent = Math.sqrt(se / Math.max(1e-9, sv)).toFixed(3);
    });
  })();

  /* ================= Fig. 11: drones survey an orchard ================= */
  (function () {
    const cv = $('#fig11'); if (!cv) return;
    const out = { n: $('#fig11-n'), h: $('#fig11-h'), s: $('#fig11-s'), x: $('#fig11-x') };
    const COLS = 10, ROWS = 5, HEALTH = ['#3FA56B', '#E2B340', '#D9594C'];
    const poles = [[0.33, 0.39], [0.67, 0.62]];
    let trees = [], drones = [], doneT = 0, seed = 3;
    const treePos = (i, j) => [0.08 + (i / (COLS - 1)) * 0.84, 0.16 + (j / (ROWS - 1)) * 0.68];
    function reset() {
      const R = seeded(seed++); trees = [];
      for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) { const q = R(), [x, y] = treePos(i, j); trees.push({ x, y, h: q < 0.72 ? 0 : q < 0.9 ? 1 : 2, seen: 0, wob: R() * 6 }); }
      const lanes = [[0, 1], [2, 3], [4]];
      drones = lanes.map((rows, d) => { const pts = []; rows.forEach((r, k) => { const y = treePos(0, r)[1], L = 0.03, Rr = 0.97; if (k % 2 === 0) pts.push([L, y], [Rr, y]); else pts.push([Rr, y], [L, y]); }); return { pts, s: -d * 0.04, x: pts[0][0], y: pts[0][1], hd: 0, avoid: 0 }; });
      doneT = 0;
    }
    reset();
    function along(pts, s) { // position on polyline by arc length
      let total = 0; const seg = []; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); total += l; }
      let d = clamp(s, 0, 1) * total; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), total]; } d -= seg[i]; }
      const p = pts[pts.length - 1]; return [p[0], p[1], total];
    }
    const st = stage(cv, 16 / 9, (dt, t) => {
      const { ctx, W, H } = st; const S = (p) => [p[0] * W, p[1] * H];
      ctx.fillStyle = '#E6EBDF'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(120,140,100,.18)'; ctx.lineWidth = W * 0.035;
      for (let j = 0; j < ROWS; j++) { const y = treePos(0, j)[1] * H; ctx.beginPath(); ctx.moveTo(W * 0.04, y); ctx.lineTo(W * 0.96, y); ctx.stroke(); }
      const tr = W * 0.026;
      // trees
      trees.forEach((tt) => {
        const [x, y] = S([tt.x, tt.y]); const pop = tt.seen > 0 && tt.seen < 1 ? 1 + 0.25 * Math.sin(tt.seen * Math.PI) : 1;
        if (tt.seen > 0 && tt.seen < 1) tt.seen = Math.min(1, tt.seen + dt * 2.5);
        ctx.fillStyle = 'rgba(29,35,48,.14)'; ctx.beginPath(); ctx.ellipse(x + tr * 0.25, y + tr * 0.3, tr * 1.05, tr * 0.9, 0, 0, Math.PI * 2); ctx.fill();
        const col = tt.seen ? HEALTH[tt.h] : '#BFC6C0';
        ctx.fillStyle = col; for (let k = 0; k < 6; k++) { const a = k * 1.05 + tt.wob; ctx.beginPath(); ctx.arc(x + Math.cos(a) * tr * 0.5 * pop, y + Math.sin(a) * tr * 0.5 * pop, tr * 0.55 * pop, 0, Math.PI * 2); ctx.fill(); }
        ctx.beginPath(); ctx.arc(x, y, tr * 0.6 * pop, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x - tr * 0.25, y - tr * 0.25, tr * 0.28 * pop, 0, Math.PI * 2); ctx.fill();
      });
      // poles (obstacles)
      poles.forEach(([px, py]) => { const [x, y] = S([px, py]); ctx.fillStyle = 'rgba(29,35,48,.18)'; ctx.beginPath(); ctx.arc(x + 4, y + 5, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.stroke(); });
      // drones
      let all = true;
      drones.forEach((d) => {
        const [, , total] = along(d.pts, 0);
        if (!reduce) d.s += (dt * 0.11) / total;
        const [bx, by] = along(d.pts, Math.max(0, d.s));
        let off = 0, near = 0; poles.forEach(([px, py]) => { const dx = bx - px; if (Math.abs(by - py) < 0.08) { const g = Math.exp(-((dx / 0.06) ** 2)); off += (by >= py ? 1 : -1) * 0.075 * g; near = Math.max(near, g); } });
        const nx = bx, ny = by + off; d.hd = Math.atan2(ny - d.y, nx - d.x) || d.hd; d.x = nx; d.y = ny; d.avoid = near;
        if (d.s < 1) all = false;
        trees.forEach((tt) => { if (!tt.seen && Math.hypot(tt.x - d.x, (tt.y - d.y) * H / W) < 0.05) tt.seen = 0.01; });
        const [x, y] = S([d.x, d.y]), fr = W * 0.05;
        ctx.fillStyle = 'rgba(43,63,224,.08)'; ctx.strokeStyle = 'rgba(43,63,224,.35)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, fr, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
        if (near > 0.3) { poles.forEach(([px, py]) => { const [qx, qy] = S([px, py]); if (Math.hypot(qx - x, qy - y) < W * 0.12) { ctx.strokeStyle = `rgba(217,89,76,${near * 0.8})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(qx, qy, 18, 0, Math.PI * 2); ctx.stroke(); } }); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(d.hd);
        ctx.fillStyle = 'rgba(29,35,48,.18)'; ctx.beginPath(); ctx.arc(6, 8, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-11, -11); ctx.lineTo(11, 11); ctx.moveTo(-11, 11); ctx.lineTo(11, -11); ctx.stroke();
        [[-11, -11], [11, 11], [-11, 11], [11, -11]].forEach(([rx, ry], k) => { ctx.fillStyle = 'rgba(29,35,48,.16)'; ctx.beginPath(); ctx.arc(rx, ry, 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(29,35,48,.7)'; ctx.lineWidth = 1.5; const a = t * 40 + k; ctx.beginPath(); ctx.moveTo(rx - Math.cos(a) * 7, ry - Math.sin(a) * 7); ctx.lineTo(rx + Math.cos(a) * 7, ry + Math.sin(a) * 7); ctx.stroke(); });
        ctx.fillStyle = COB; rr(ctx, -6, -5, 12, 10, 3); ctx.fill(); ctx.fillStyle = Math.sin(t * 8) > 0 ? '#7CF0B0' : '#2B3FE0'; ctx.beginPath(); ctx.arc(5, 0, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      if (reduce) trees.forEach((tt) => (tt.seen = 1));
      const seen = trees.filter((tt) => tt.seen > 0);
      out.n.textContent = seen.length; out.h.textContent = seen.filter((tt) => tt.h === 0).length; out.s.textContent = seen.filter((tt) => tt.h === 1).length; out.x.textContent = seen.filter((tt) => tt.h === 2).length;
      if (all && !reduce) { doneT += dt; if (doneT > 2.2) reset(); }
    });
  })();
})();
