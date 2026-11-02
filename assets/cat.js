/* Fig. 12. On the Active Rheology of Cats.
   Drag a point across the paper's (De, Fe) state diagram and the cat responds:
   low De, it takes the shape of the sink; high Fe, it leaves, by flowing or by launching.
   Click the cat to pet it. */
(function () {
  const cv = document.getElementById('cat');
  const pad = document.getElementById('cat-pad');
  if (!cv || !pad) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const knob = pad.querySelector('.knob');
  const out = { de: document.getElementById('cat-de'), fe: document.getElementById('cat-fe'), regime: document.getElementById('cat-regime'), exits: document.getElementById('cat-exits') };
  const C = { wall: '#E9ECF1', tile: 'rgba(199,204,213,.45)', counter: '#D6DBE3', counterEdge: '#C3C9D3', porcelain: '#FBFCFD', porcelainShade: '#E3E7ED', inside: '#D9DEE6', chrome: '#9AA3B2', chromeHi: '#E8ECF2', fur: '#2A3040', furShade: '#222735', white: '#FBFBFD', pink: '#F2A3B5', innerEar: '#F4B7C5', blush: 'rgba(244,135,165,.32)', amber: '#F2B84B', pupil: '#12151C', cobalt: '#2B3FE0', slate: '#576072', heart: '#F06B8B', water: 'rgba(120,170,230,.8)' };

  // ---------- state ----------
  const S = { lde: Math.log10(0.3), lfe: Math.log10(2.2), mode: 'in', p: 0, outT: 0, exits: 0, act: 0, actHold: 0, startle: 0, alarm: 0, twitch: 0, flowing: false, L: 0.8, pet: 0, blinkT: 2, blink: 0 };
  const trace = [], hearts = [], drips = [];
  const regimeOf = () => {
    const lo = S.lde < 0, go = S.lfe > 0;
    if (lo && !go) return 'Shape-adapted, resident';
    if (lo && go) return 'Shape-adapted, able to exit';
    if (!lo && go) return 'Elastic launch';
    return 'Solid-like quiescence';
  };
  function readouts() {
    out.de.textContent = (10 ** S.lde).toFixed(2);
    out.fe.textContent = (10 ** S.lfe).toFixed(2);
    out.regime.textContent = regimeOf();
    out.exits.textContent = S.exits;
    knob.style.left = ((S.lde + 1) / 2) * 100 + '%';
    knob.style.top = (1 - (S.lfe + 1) / 2) * 100 + '%';
    pad.setAttribute('aria-valuetext', `De ${out.de.textContent}, Fe ${out.fe.textContent}, ${out.regime.textContent}`);
  }

  // ---------- controls ----------
  function setFromPointer(e) {
    const r = pad.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    S.lde = x * 2 - 1; S.lfe = (1 - y) * 2 - 1; readouts(); if (reduce) still();
  }
  let dragging = false;
  pad.addEventListener('pointerdown', (e) => { dragging = true; pad.setPointerCapture(e.pointerId); pad.classList.add('dragging'); setFromPointer(e); });
  pad.addEventListener('pointermove', (e) => { if (dragging) setFromPointer(e); });
  const end = () => { dragging = false; pad.classList.remove('dragging'); };
  pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
  pad.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[e.key];
    if (!k) return; e.preventDefault();
    S.lde = Math.min(1, Math.max(-1, S.lde + k[0])); S.lfe = Math.min(1, Math.max(-1, S.lfe + k[1])); readouts(); if (reduce) still();
  });
  document.getElementById('cat-startle').addEventListener('click', () => { S.startle = 1; S.alarm = 1; S.act = 1; S.actHold = 0.9; });
  readouts();

  // ---------- canvas ----------
  let W = 0, H = 0, ctx, dpr = 1;
  function fit() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = Math.round(W / 1.7); cv.style.height = H + 'px';
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const geom = () => {
    const R = Math.min(W * 0.15, H * 0.27), counterY = H * 0.76, sinkX = W * 0.32, D = R * 0.62, rimY = counterY - D;
    return { R, counterY, sinkX, D, rimY, rx: R * 1.08, ry: R * 0.2, landX: W * 0.68 };
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (x) => 1 - (1 - x) ** 3;
  const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

  // ---------- simulation ----------
  function step(dt) {
    const fe = 10 ** S.lfe, de = 10 ** S.lde;
    const targetL = 1 / (1 + de ** 1.4);
    S.L += (targetL - S.L) * Math.min(1, dt * 3);
    if (S.actHold > 0) S.actHold -= dt;
    else {
      if (S.act === 0 && Math.random() < 0.22 * dt) { S.act = 1; S.actHold = 0.4 + Math.random() * 0.8; }
      else if (S.act === 1 && Math.random() < 0.9 * dt) S.act = 0;
    }
    trace.push(S.act); if (trace.length > 600) trace.shift();
    if (S.mode === 'in') {
      const feEff = fe * (S.startle ? 3 : 1);
      if (S.act && feEff > 1 && Math.random() < (1 - Math.exp(-(feEff - 1) * 1.6)) * dt * 4) { S.mode = 'leave'; S.p = 0; S.flowing = de < 1; S.startle = 0; }
      else if (S.startle) { S.startle = 0; S.twitch = 1; }
    } else if (S.mode === 'leave') {
      S.p += dt / (S.flowing ? 2.0 : 1.1);
      if (S.p >= 1) { S.mode = 'out'; S.outT = 0; S.exits++; out.exits.textContent = S.exits; }
    } else if (S.mode === 'out') {
      S.outT += dt; if (S.outT > 2.2) { S.mode = 'back'; S.p = 0; }
    } else if (S.mode === 'back') {
      S.p += dt / 1.0; if (S.p >= 1) { S.mode = 'in'; S.p = 0; }
    }
    S.twitch = Math.max(0, S.twitch - dt * 2.2);
    S.alarm = Math.max(0, S.alarm - dt * 0.8);
    S.pet = Math.max(0, S.pet - dt * 0.55);
    S.blinkT -= dt; if (S.blinkT < 0) { S.blink = 0.16; S.blinkT = 2.5 + Math.random() * 3.5; }
    S.blink = Math.max(0, S.blink - dt);
    for (let k = hearts.length - 1; k >= 0; k--) { const h = hearts[k]; h.t += dt; h.y -= dt * 38; h.x += Math.sin(h.t * 5 + h.seed) * dt * 18; if (h.t > 1.6) hearts.splice(k, 1); }
    if (Math.random() < dt * 0.35) drips.push({ y: 0, v: 0 });
    for (let k = drips.length - 1; k >= 0; k--) { const d = drips[k]; d.v += dt * 420; d.y += d.v * dt; if (d.y > 400) drips.splice(k, 1); }
  }

  // ---------- pose ----------
  // Body is a superellipse (cx, cy, a, b, n). Head is an ellipse with ears.
  function pose(g, t) {
    const R = g.R, L = S.L;
    const loafIn = { cx: g.sinkX, cy: g.rimY - R * 0.1, a: R * 0.66, b: R * 0.46, n: 2.6 };
    const pudIn = { cx: g.sinkX, cy: g.rimY + R * 0.16, a: R * 1.0, b: R * 0.38, n: 2.2 };
    const sitOut = { cx: g.landX, cy: g.counterY - R * 0.46, a: R * 0.62, b: R * 0.46, n: 2.6 };
    const flatOut = { cx: g.landX, cy: g.counterY - R * 0.2, a: R * 0.9, b: R * 0.21, n: 3.2 };
    const mixB = (A, B, k) => ({ cx: lerp(A.cx, B.cx, k), cy: lerp(A.cy, B.cy, k), a: lerp(A.a, B.a, k), b: lerp(A.b, B.b, k), n: lerp(A.n, B.n, k) });
    const outBody = mixB(sitOut, flatOut, Math.min(L, 0.7));
    const inBody = mixB(loafIn, pudIn, L);
    // head relative positions
    const headIn = { x: lerp(g.sinkX + R * 0.4, g.sinkX + R * 0.28, L), y: lerp(loafIn.cy - loafIn.b - R * 0.08, g.rimY - R * 0.38, L) };
    const headOut = { x: outBody.cx + outBody.a * 0.62, y: outBody.cy - outBody.b - R * 0.12 + Math.min(L, 0.7) * R * 0.05 };
    let body = inBody, head = { ...headIn }, inside = true, air = 0, sx = 1, sy = 1, paws = 'rim', squish = lerp(1, 0.9, L), face = 1;
    if (S.mode === 'leave') {
      const p = S.p;
      if (S.flowing) {
        const e = easeIO(p); inside = p < 0.35;
        body = mixB(pudIn, flatOut, e); body.cy -= Math.sin(p * Math.PI) * R * 0.55; body.a *= 1 + 0.25 * Math.sin(p * Math.PI);
        head = { x: body.cx + body.a * 0.7, y: body.cy - body.b - R * 0.14 }; paws = 'none'; squish = 0.88;
      } else {
        const e = ease(p); inside = p < 0.12; air = Math.sin(p * Math.PI);
        body = mixB(loafIn, sitOut, e); body.cy -= air * H * 0.3;
        const sq = p < 0.12 ? 1 - p / 0.12 * 0.22 : p > 0.88 ? 0.78 + (1 - p) / 0.12 * 0.22 : 1.14; sy = sq; sx = 2 - sq;
        body.a *= sx; body.b *= sy;
        head = { x: body.cx + body.a * 0.78, y: body.cy - body.b * 0.6 - R * 0.12 }; paws = air > 0.2 ? 'air' : 'none';
      }
    } else if (S.mode === 'out') { body = outBody; head = headOut; inside = false; paws = 'sit'; squish = lerp(1, 0.9, Math.min(L, 0.7)); }
    else if (S.mode === 'back') {
      const e = ease(S.p); air = Math.sin(S.p * Math.PI); inside = S.p > 0.85;
      body = mixB(outBody, inBody, e); body.cy -= air * H * 0.2;
      head = { x: body.cx + body.a * 0.5 * (1 - e) + (headIn.x - inBody.cx) * e, y: body.cy - body.b - R * 0.1 };
      paws = 'none';
    } else {
      head.y -= S.twitch * R * 0.25 * Math.sin(S.twitch * Math.PI);
      body = { ...body, cy: body.cy - S.twitch * R * 0.2 * Math.sin(S.twitch * Math.PI) };
    }
    const puff = 1 + S.alarm * 0.08;
    const breathe = reduce ? 1 : 1 + 0.02 * Math.sin(t * 2.1);
    body.a *= puff; body.b *= puff * breathe;
    return { body, head, inside, air, paws, squish, R };
  }

  // ---------- drawing helpers ----------
  function superPath(B) {
    ctx.beginPath();
    for (let i = 0; i <= 72; i++) {
      const th = (i / 72) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th), e = 2 / B.n;
      const x = B.cx + B.a * Math.sign(c) * Math.abs(c) ** e, y = B.cy + B.b * Math.sign(s) * Math.abs(s) ** e;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
  function heartPath(x, y, s) {
    ctx.beginPath(); ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3); ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3); ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3); ctx.closePath();
  }

  function drawScene(g, t) {
    ctx.fillStyle = C.wall; ctx.fillRect(0, 0, W, g.counterY);
    ctx.strokeStyle = C.tile; ctx.lineWidth = 1;
    const ts = Math.max(26, W / 22);
    for (let y = g.counterY - ts; y > 0; y -= ts) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let x = ts / 2; x < W; x += ts) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, g.counterY); ctx.stroke(); }
    ctx.fillStyle = C.counter; ctx.fillRect(0, g.counterY, W, H - g.counterY);
    ctx.fillStyle = C.counterEdge; ctx.fillRect(0, g.counterY, W, 3);
    // faucet behind the bowl
    const fx = g.sinkX - g.R * 1.7, top = g.rimY - g.R * 0.95;
    ctx.strokeStyle = C.chrome; ctx.lineWidth = g.R * 0.09; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(fx, g.counterY); ctx.lineTo(fx, top + g.R * 0.2); ctx.quadraticCurveTo(fx, top, fx + g.R * 0.25, top); ctx.lineTo(fx + g.R * 0.82, top); ctx.lineTo(fx + g.R * 0.82, top + g.R * 0.1); ctx.stroke();
    ctx.strokeStyle = C.chromeHi; ctx.lineWidth = g.R * 0.025; ctx.beginPath(); ctx.moveTo(fx - g.R * 0.015, g.counterY - 4); ctx.lineTo(fx - g.R * 0.015, top + g.R * 0.22); ctx.stroke();
    // drips
    if (!reduce) drips.forEach((d) => { const y = top + g.R * 0.14 + d.y; if (y < g.rimY + g.ry * 0.2) { ctx.fillStyle = C.water; ctx.beginPath(); ctx.ellipse(fx + g.R * 0.82, y, 2.4, 3.4, 0, 0, Math.PI * 2); ctx.fill(); } });
    // bowl interior (back)
    ctx.fillStyle = C.inside; ctx.beginPath(); ctx.ellipse(g.sinkX, g.rimY, g.rx, g.ry, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawBowlFront(g) {
    const base = g.R * 0.62;
    ctx.fillStyle = C.porcelain; ctx.strokeStyle = C.porcelainShade; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(g.sinkX - g.rx, g.rimY);
    ctx.ellipse(g.sinkX, g.rimY, g.rx, g.ry, 0, Math.PI, 0, true);
    ctx.bezierCurveTo(g.sinkX + g.rx, g.rimY + g.D * 0.75, g.sinkX + base, g.counterY - 2, g.sinkX + base * 0.8, g.counterY);
    ctx.lineTo(g.sinkX - base * 0.8, g.counterY);
    ctx.bezierCurveTo(g.sinkX - base, g.counterY - 2, g.sinkX - g.rx, g.rimY + g.D * 0.75, g.sinkX - g.rx, g.rimY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // soft shading
    const gr = ctx.createLinearGradient(g.sinkX - g.rx, 0, g.sinkX + g.rx, 0);
    gr.addColorStop(0, 'rgba(195,201,211,.35)'); gr.addColorStop(0.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(195,201,211,.5)');
    ctx.fillStyle = gr; ctx.fill();
    // rim lip
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(g.sinkX, g.rimY, g.rx, g.ry, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
  }
  function drawBowlBackRim(g) {
    ctx.strokeStyle = C.porcelainShade; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(g.sinkX, g.rimY, g.rx, g.ry, 0, Math.PI, Math.PI * 2); ctx.stroke();
  }

  function drawTail(P, t) {
    const B = P.body, R = P.R, sw = reduce ? 0 : Math.sin(t * (S.act || S.alarm ? 5 : 1.6)) * R * (S.act ? 0.22 : 0.12);
    const x0 = B.cx - B.a * 0.82, y0 = B.cy + B.b * 0.1, lw = R * (0.16 + 0.05 * S.alarm);
    const c1x = x0 - R * 0.42, c1y = y0 + R * 0.05, c2x = x0 - R * 0.55 + sw, c2y = y0 - R * 0.6, ex = x0 - R * 0.18 + sw * 1.3, ey = y0 - R * 0.9;
    ctx.lineCap = 'round'; ctx.strokeStyle = C.fur; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey); ctx.stroke();
    // white tip
    ctx.strokeStyle = C.white; ctx.lineWidth = lw * 0.92; ctx.beginPath();
    const tt = 0.86, bx = (u) => (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * c1x + 3 * (1 - u) * u * u * c2x + u ** 3 * ex, by = (u) => (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * c1y + 3 * (1 - u) * u * u * c2y + u ** 3 * ey;
    ctx.moveTo(bx(tt), by(tt)); ctx.lineTo(bx(0.94), by(0.94)); ctx.lineTo(ex, ey); ctx.stroke();
  }
  function drawBody(P) {
    ctx.fillStyle = C.fur; superPath(P.body); ctx.fill();
    // white bib under the chin
    const B = P.body, R = P.R;
    ctx.save(); superPath(B); ctx.clip();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.ellipse(P.head.x - R * 0.02, P.head.y + R * 0.52, R * 0.22, R * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawPaws(P, g) {
    const R = P.R; ctx.fillStyle = C.white; ctx.strokeStyle = 'rgba(29,35,48,.25)'; ctx.lineWidth = 1;
    const paw = (x, y, rx, ry, rot) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - rx * 0.3, y + ry * 0.1); ctx.lineTo(x - rx * 0.3, y + ry * 0.7); ctx.moveTo(x + rx * 0.3, y + ry * 0.1); ctx.lineTo(x + rx * 0.3, y + ry * 0.7); ctx.stroke(); };
    if (P.paws === 'rim') { const y = g.rimY + g.ry * 0.75; paw(P.head.x - R * 0.24, y, R * 0.13, R * 0.1); paw(P.head.x + R * 0.2, y, R * 0.13, R * 0.1); }
    else if (P.paws === 'sit') { const y = g.counterY - R * 0.08; paw(P.body.cx + R * 0.18, y, R * 0.13, R * 0.09); paw(P.body.cx + R * 0.44, y, R * 0.13, R * 0.09); }
    else if (P.paws === 'air') { const B = P.body; paw(B.cx + B.a * 0.9, B.cy + B.b * 0.35, R * 0.14, R * 0.08, -0.4); paw(B.cx - B.a * 0.85, B.cy + B.b * 0.5, R * 0.13, R * 0.08, 0.5); }
  }
  function drawHead(P, t) {
    const R = P.R, hr = R * 0.4, hx = P.head.x, hy = P.head.y, sq = P.squish;
    const awake = S.lfe > 0 || S.act || S.mode !== 'in' || S.alarm > 0.05 || S.pet > 0.05;
    const happy = S.pet > 0.05, alarmed = S.alarm > 0.05;
    const earFlat = alarmed ? 0.55 : happy ? 0.15 : 0;
    // ears
    [-1, 1].forEach((sd) => {
      const ang = sd * (0.55 + earFlat), bx = hx + Math.sin(ang) * hr * 0.92, by = hy - Math.cos(ang) * hr * 0.92 * sq;
      const tipx = hx + Math.sin(ang + sd * 0.22) * hr * 1.42, tipy = hy - Math.cos(ang + sd * 0.22) * hr * 1.42 * sq;
      const px = Math.cos(ang) * hr * 0.36, py = Math.sin(ang) * hr * 0.36;
      ctx.fillStyle = C.fur; ctx.beginPath(); ctx.moveTo(bx - px, by - py); ctx.quadraticCurveTo(tipx - px * 0.1, tipy - py * 0.1, tipx, tipy); ctx.quadraticCurveTo(tipx + px * 0.1, tipy + py * 0.1, bx + px, by + py); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.innerEar; ctx.beginPath(); ctx.moveTo(bx - px * 0.5, by - py * 0.5 + hr * 0.05); ctx.quadraticCurveTo(lerp(bx, tipx, 0.75), lerp(by, tipy, 0.75), lerp(bx, tipx, 0.82), lerp(by, tipy, 0.82)); ctx.quadraticCurveTo(lerp(bx, tipx, 0.7), lerp(by, tipy, 0.7) + hr * 0.04, bx + px * 0.5, by + py * 0.5 + hr * 0.05); ctx.closePath(); ctx.fill();
    });
    // head
    ctx.fillStyle = C.fur; ctx.beginPath(); ctx.ellipse(hx, hy, hr * 1.14, hr * sq, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx, hy + hr * 0.25 * sq, hr * 1.2, hr * 0.62 * sq, 0, 0, Math.PI); ctx.fill(); // cheeks
    // white blaze and muzzle
    ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.moveTo(hx, hy - hr * 0.5 * sq); ctx.quadraticCurveTo(hx + hr * 0.16, hy, hx + hr * 0.3, hy + hr * 0.25 * sq); ctx.lineTo(hx - hr * 0.3, hy + hr * 0.25 * sq); ctx.quadraticCurveTo(hx - hr * 0.16, hy, hx, hy - hr * 0.5 * sq); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx - hr * 0.2, hy + hr * 0.42 * sq, hr * 0.3, hr * 0.26 * sq, 0, 0, Math.PI * 2); ctx.ellipse(hx + hr * 0.2, hy + hr * 0.42 * sq, hr * 0.3, hr * 0.26 * sq, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx, hy + hr * 0.62 * sq, hr * 0.22, hr * 0.14 * sq, 0, 0, Math.PI * 2); ctx.fill();
    // blush
    ctx.fillStyle = C.blush; [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.ellipse(hx + sd * hr * 0.6, hy + hr * 0.34 * sq, hr * 0.17, hr * 0.1, 0, 0, Math.PI * 2); ctx.fill(); });
    // eyes
    const ey = hy + hr * 0.05 * sq, blink = S.blink > 0 ? Math.max(0.1, Math.abs(S.blink - 0.08) / 0.08) : 1;
    [-1, 1].forEach((sd) => {
      const ex = hx + sd * hr * 0.44;
      if (!awake || happy) {
        ctx.strokeStyle = C.white; ctx.lineWidth = Math.max(1.6, hr * 0.07); ctx.lineCap = 'round'; ctx.beginPath();
        if (happy) ctx.arc(ex, ey + hr * 0.06, hr * 0.13, Math.PI * 1.1, Math.PI * 1.9); else ctx.arc(ex, ey - hr * 0.04, hr * 0.13, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke(); return;
      }
      const rx = hr * 0.19, ry = hr * 0.23 * blink * (alarmed ? 1.12 : 1);
      ctx.fillStyle = C.amber; ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      if (blink > 0.4) {
        const look = (S.mode === 'leave' || S.mode === 'out') ? hr * 0.04 : Math.sin(t * 0.7) * hr * 0.03;
        ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.ellipse(ex + look, ey + hr * 0.01, rx * (alarmed ? 0.45 : 0.62), ry * 0.9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex - rx * 0.32 + look, ey - ry * 0.35, rx * 0.28, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + rx * 0.25 + look, ey + ry * 0.3, rx * 0.12, 0, Math.PI * 2); ctx.fill();
      }
    });
    // nose and mouth
    const ny = hy + hr * 0.33 * sq;
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(hx - hr * 0.09, ny - hr * 0.04); ctx.quadraticCurveTo(hx, ny - hr * 0.08, hx + hr * 0.09, ny - hr * 0.04); ctx.quadraticCurveTo(hx + hr * 0.02, ny + hr * 0.06, hx, ny + hr * 0.07); ctx.quadraticCurveTo(hx - hr * 0.02, ny + hr * 0.06, hx - hr * 0.09, ny - hr * 0.04); ctx.fill();
    ctx.strokeStyle = '#5B5F6B'; ctx.lineWidth = Math.max(1.2, hr * 0.035); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx, ny + hr * 0.07); ctx.lineTo(hx, ny + hr * 0.13);
    ctx.arc(hx - hr * 0.08, ny + hr * 0.13, hr * 0.08, 0, Math.PI * 0.95); ctx.moveTo(hx + hr * 0.16, ny + hr * 0.13); ctx.arc(hx + hr * 0.08, ny + hr * 0.13, hr * 0.08, 0, Math.PI, false); ctx.stroke();
    if (alarmed) { ctx.fillStyle = '#5B5F6B'; ctx.beginPath(); ctx.ellipse(hx, ny + hr * 0.24, hr * 0.06, hr * 0.08, 0, 0, Math.PI * 2); ctx.fill(); }
    // whiskers
    const tw = reduce ? 0 : Math.sin(t * 3) * hr * 0.02;
    ctx.strokeStyle = 'rgba(232,236,242,.9)'; ctx.lineWidth = Math.max(1, hr * 0.022);
    [-1, 1].forEach((sd) => { for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(hx + sd * hr * 0.42, ny + hr * 0.08 + k * hr * 0.07); ctx.quadraticCurveTo(hx + sd * hr * 0.9, ny + k * hr * 0.14 + tw, hx + sd * hr * 1.38, ny + k * hr * 0.22 - hr * 0.02 + tw); ctx.stroke(); } });
    // sleep and alarm marks
    if (!awake && S.mode === 'in') {
      ctx.fillStyle = C.slate; ctx.font = `600 ${Math.round(hr * 0.42)}px "Schibsted Grotesk", Arial, sans-serif`;
      for (let k = 0; k < 3; k++) { const ph = reduce ? k / 3 : ((t * 0.32 + k / 3) % 1); ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.fillText('z', hx + hr * 1.0 + ph * hr * 0.9, hy - hr * 0.9 - ph * hr * 1.4); }
      ctx.globalAlpha = 1;
    }
    if (alarmed) { ctx.fillStyle = C.cobalt; ctx.font = `700 ${Math.round(hr * 0.75)}px "Schibsted Grotesk", Arial, sans-serif`; ctx.globalAlpha = Math.min(1, S.alarm * 1.5); ctx.fillText('!', hx + hr * 1.15, hy - hr * 1.05); ctx.globalAlpha = 1; }
  }
  function drawShadow(P, g) {
    const B = P.body, lift = Math.max(0, g.counterY - (B.cy + B.b));
    ctx.fillStyle = `rgba(29,35,48,${0.16 * Math.max(0.25, 1 - lift / (H * 0.3))})`;
    ctx.beginPath(); ctx.ellipse(B.cx, g.counterY + 2, B.a * (0.8 - Math.min(0.3, lift / (H * 0.8))), P.R * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  }

  let lastPose = null;
  function draw(t) {
    const g = geom();
    ctx.clearRect(0, 0, W, H);
    drawScene(g, t);
    const P = pose(g, t); lastPose = P;
    if (P.inside) {
      drawBowlBackRim(g); drawTail(P, t); drawBody(P); drawBowlFront(g); drawPaws(P, g); drawHead(P, t);
    } else {
      drawBowlBackRim(g); drawBowlFront(g); drawShadow(P, g); drawTail(P, t); drawBody(P); drawPaws(P, g); drawHead(P, t);
    }
    hearts.forEach((h) => { ctx.globalAlpha = Math.max(0, 1 - h.t / 1.6); ctx.fillStyle = C.heart; heartPath(h.x, h.y, h.s); ctx.fill(); });
    ctx.globalAlpha = 1;
    if (S.pet > 0.3) { ctx.fillStyle = C.slate; ctx.font = `500 ${Math.round(P.R * 0.16)}px "Schibsted Grotesk", Arial, sans-serif`; ctx.globalAlpha = Math.min(1, (S.pet - 0.3) * 2); ctx.fillText('purr', P.head.x - P.R * 1.05, P.head.y - P.R * 0.55); ctx.globalAlpha = 1; }
    // activity trace
    const tx = W * 0.56, tw = W * 0.38, ty = H * 0.94, th = H * 0.08;
    ctx.font = '500 12px "Schibsted Grotesk", Arial, sans-serif'; ctx.fillStyle = C.slate; ctx.fillText('Activity a(t)', tx, ty - th - 6);
    ctx.strokeStyle = 'rgba(87,96,114,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + tw, ty); ctx.stroke();
    ctx.strokeStyle = C.cobalt; ctx.lineWidth = 1.6; ctx.beginPath();
    const n = trace.length; for (let i = 0; i < n; i++) { const px = tx + ((i + 600 - n) / 599) * tw, py = ty - trace[i] * th; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  }

  // petting
  function hit(e) {
    if (!lastPose) return false;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, P = lastPose, B = P.body;
    return Math.hypot(x - P.head.x, y - P.head.y) < P.R * 0.6 || (Math.abs(x - B.cx) < B.a && Math.abs(y - B.cy) < B.b);
  }
  cv.addEventListener('pointermove', (e) => { cv.style.cursor = hit(e) ? 'pointer' : 'default'; });
  cv.addEventListener('click', (e) => {
    if (!hit(e)) return;
    S.pet = 1.6; S.alarm = 0;
    for (let k = 0; k < 4; k++) hearts.push({ x: lastPose.head.x + (Math.random() - 0.5) * lastPose.R * 0.8, y: lastPose.head.y - lastPose.R * 0.5, s: lastPose.R * (0.14 + Math.random() * 0.08), t: -k * 0.12, seed: Math.random() * 6 });
    if (reduce) still();
  });

  fit();
  let raf = 0, last = performance.now(), T = 0;
  const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt; step(dt); draw(T); raf = requestAnimationFrame(loop); };
  function still() { S.L = 1 / (1 + (10 ** S.lde) ** 1.4); draw(0); }
  if (reduce) still();
  else {
    draw(0);
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf = 0; } }), { threshold: 0.05 }).observe(cv);
    else raf = requestAnimationFrame(loop);
  }
  let lastW = cv.clientWidth;
  new ResizeObserver(() => { if (Math.abs(cv.clientWidth - lastW) < 2) return; lastW = cv.clientWidth; fit(); draw(T); }).observe(cv.parentElement);
})();
