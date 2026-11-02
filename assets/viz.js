/* Figures 5–11, the research timeline, and the charts in Building and Honors.
   Every chart is drawn complete at rest; motion only plays when a figure scrolls into view. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const C = { cobalt: '#2B3FE0', graphite: '#1D2330', slate: '#576072', rule: '#C7CCD5', paper: '#F6F7F9', fog: '#E8EAEE', teal: '#0F7A84', violet: '#6A44D6', sky: '#3B8EE0', steel: '#7A88A4' };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Run once when an element is mostly in view. If it starts off-screen, prep() puts it in its pre-animation state.
  function onEnter(node, run, prep, threshold = 0.35) {
    if (!node) return;
    if (reduce || !('IntersectionObserver' in window)) return;
    const r = node.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: leave it complete
    if (prep) prep();
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); run(); } }), { threshold });
    io.observe(node);
  }
  const grow = (node, th) => onEnter(node, () => requestAnimationFrame(() => node.classList.remove('pre')), () => node.classList.add('pre'), th);
  /* ---------- Research timeline ---------- */
  const FIELDS = {
    ml: { name: 'Machine learning', color: C.cobalt },
    formal: { name: 'Formal methods', color: C.graphite },
    phys: { name: 'Physics and materials', color: C.teal },
    aero: { name: 'Aerospace', color: C.violet },
    bio: { name: 'Biophysics', color: C.sky },
    eng: { name: 'Engineering', color: C.steel },
  };
  const PROJECTS = [
    { t: 'Formal verification and LLM theorem proving', o: 'Capital One collaboration, research lead', s: '2026-09', e: null, f: 'formal', href: '#formal', d: 'Fall 2026 – now' },
    { t: 'Weak RF fields and cancer-cell biophysics', o: 'University of Colorado Boulder', s: '2026-07', e: '2026-08', f: 'bio', href: '#biophysics', d: 'Jul – Aug 2026' },
    { t: 'World models for computer-use agents', o: 'George Washington University', s: '2026-04', e: '2026-09', f: 'ml', href: '#futures', d: 'Apr – Sep 2026' },
    { t: 'CubeSat formation control', o: 'First author, AAS/AIAA 2026', s: '2026-02', e: '2026-05', f: 'aero', href: '#cubesat', d: 'Feb – May 2026' },
    { t: 'Masked diffusion models', o: 'Yale University', s: '2026-01', e: '2026-07', f: 'ml', href: '#masked-diffusion', d: 'Jan – Jul 2026' },
    { t: 'Magnon dynamics in 2D magnets', o: 'UC San Diego', s: '2026-01', e: '2026-07', f: 'phys', href: '#magnons', d: 'Jan – Jul 2026' },
    { t: 'MonoScan, 2D materials software', o: 'University of Notre Dame', s: '2026-01', e: '2026-04', f: 'phys', href: '#monoscan', d: 'Jan – Apr 2026' },
    { t: 'Spintronic reservoir computing', o: 'Independent, county science fair winner', s: '2025-07', e: '2026-03', f: 'phys', href: '#reservoir', d: 'Jul 2025 – Mar 2026' },
    { t: 'Task matrices', o: 'Algoverse AI Research, NeurIPS 2025 workshop', s: '2025-05', e: '2025-08', f: 'ml', href: '#task-matrices', d: 'May – Aug 2025' },
    { t: 'LLM safety, self-driving sims, drones', o: 'ASDRP', s: '2023-05', e: '2025-05', f: 'eng', href: '#asdrp', d: 'May 2023 – 2025' },
  ];
  const D0 = new Date('2023-05-01').getTime(), D1 = new Date('2027-01-01').getTime(), NOW = new Date('2026-11-01').getTime();
  const pos = (ym, end) => { const [y, m] = ym.split('-').map(Number); const t = new Date(y, m - 1 + (end ? 1 : 0), 1).getTime(); return ((t - D0) / (D1 - D0)) * 100; };
  const nowPct = ((NOW - D0) / (D1 - D0)) * 100;
  const gantt = $('#gantt');
  if (gantt) {
    const axis = el('div', 'g-axis', '<span class="g-label"></span>');
    const ticks = el('span', 'g-track');
    [2024, 2025, 2026].forEach((y) => ticks.appendChild(el('span', 'g-tick', `<span>${y}</span>`)));
    [...ticks.children].forEach((t, i) => (t.style.left = pos(`${2024 + i}-01`) + '%'));
    const nowTick = el('span', 'g-tick g-now', '<span>Now</span>'); nowTick.style.left = nowPct + '%'; ticks.appendChild(nowTick);
    axis.appendChild(ticks); gantt.appendChild(axis);
    PROJECTS.forEach((p, i) => {
      const a = el('a', 'g-row'); a.href = p.href; a.setAttribute('role', 'listitem');
      const left = pos(p.s), right = p.e ? pos(p.e, true) : nowPct;
      a.innerHTML = `<span class="g-label"><b>${esc(p.t)}</b><span>${esc(p.o)}</span></span><span class="g-track"><span class="g-grid"></span><span class="g-bar${p.e ? '' : ' ongoing'}"></span><span class="g-dates">${esc(p.d)}</span></span>`;
      const bar = a.querySelector('.g-bar');
      bar.style.left = left + '%'; bar.style.width = Math.max(1.2, right - left) + '%'; bar.style.background = FIELDS[p.f].color;
      bar.style.setProperty('--i', i);
      const dates = a.querySelector('.g-dates');
      if (right > 72) { dates.style.right = (100 - left) + '%'; dates.classList.add('before'); } else dates.style.left = `calc(${right}% + 10px)`;
      a.setAttribute('aria-label', `${p.t}, ${p.o}, ${p.d}`);
      gantt.appendChild(a);
    });
    const grid = () => { const g = gantt.querySelectorAll('.g-grid'); g.forEach((x) => { x.innerHTML = [2024, 2025, 2026].map((y) => `<i style="left:${pos(y + '-01')}%"></i>`).join('') + `<i class="now" style="left:${nowPct}%"></i>`; }); };
    grid();
    const legend = $('#gantt-legend');
    Object.values(FIELDS).forEach((f) => legend.appendChild(el('li', null, `<i style="background:${f.color}"></i>${f.name}`)));
    grow(gantt, 0.2);
  }

  /* ---------- Bar charts (HTML) ---------- */
  function bars(node, title, rows, max, fmt, note) {
    if (!node) return;
    let h = title ? `<p class="chart-title">${title}</p>` : '';
    h += '<div class="bar-rows">';
    rows.forEach((r, i) => {
      const a = r.range ? r.range[0] : 0, b = r.range ? r.range[1] : r.v;
      h += `<div class="bar-row${r.hl ? ' hl' : ''}"><span class="bar-label">${r.label}</span><span class="bar-track"><span class="bar-fill" style="left:${(a / max) * 100}%;width:${Math.max(0.6, ((b - a) / max) * 100)}%;--i:${i}"></span></span><span class="bar-val">${fmt(r)}</span></div>`;
    });
    h += '</div>' + (note ? `<p class="bar-note">${note}</p>` : '');
    node.insertAdjacentHTML('beforeend', h);
  }
  const rmsNode = $('#rms-bars');
  bars(rmsNode, 'Mean position error, RMS', [
    { label: 'Invariant-map controller', v: 678.8, hl: true },
    { label: 'Planner A', v: 922.9 },
    { label: 'Planner B', v: 1027.8 },
    { label: 'Uncontrolled', v: 4776.5 },
  ], 4776.5, (r) => r.v.toLocaleString('en-US', { minimumFractionDigits: 1 }) + ' m');
  bars(rmsNode, 'Model disagreement over eight orbits', [
    { label: 'Before the coefficient fix', range: [182, 185] },
    { label: 'After', range: [14, 20], hl: true },
  ], 200, (r) => `${r.range[0]}–${r.range[1]} m`);
  bars($('#asdrp-bars'), null, [
    { label: 'Navigation performance, ROS 2 cars', v: 15, hl: true },
    { label: 'Tree-health data collection, drones', v: 20, hl: true },
    { label: 'Drone safety', v: 35, hl: true },
  ], 40, (r) => '+' + r.v + '%', 'Scale runs from 0 to 40% improvement.');
  document.querySelectorAll('.bar-rows:not(.ladder-rows)').forEach((b) => grow(b, 0.5));

  /* ---------- Nalem Study Circle reach (log scale) ---------- */
  const reach = $('#reach');
  if (reach) {
    const pts = [
      { v: 12, b: '12', s: 'countries' },
      { v: 2400, b: '2,400+', s: 'students served' },
      { v: 100000, b: '100,000+', s: 'structured learning requests' },
      { v: 200000, b: '200,000+', s: 'learners reached by resources' },
    ];
    const x = (v) => ((Math.log10(v) - 0.6) / (5.6 - 0.6)) * 100;
    let h = '<div class="r-axis">';
    [10, 100, 1000, 10000, 100000].forEach((v) => (h += `<span class="r-tick" style="left:${x(v)}%"><span>${v >= 1000 ? v / 1000 + 'k' : v}</span></span>`));
    pts.forEach((p, i) => (h += `<span class="r-pt ${i % 2 ? 'below' : 'above'}${x(p.v) < 14 ? ' l' : x(p.v) > 86 ? ' r' : ''}" style="left:${x(p.v)}%;--i:${i}"><i></i><span><b>${p.b}</b>${p.s}</span></span>`));
    h += '</div>';
    reach.innerHTML = h;
    grow(reach, 0.5);
  }

  /* ---------- Honors ---------- */
  const ladder = $('#ladder');
  if (ladder) {
    const rows = [
      { n: 'Stanford Math Tournament 2025–26', d: 'Team, overall', v: 98.3, l: 'Top 10 of 600' },
      { n: 'Berkeley Math Tournament 2025–26', d: 'Team, Guts round', v: 97.5, l: 'Top 10 of 400' },
      { n: 'Berkeley Math Tournament', d: 'Individual, Algebra and Geometry', v: 90, l: 'Top 10%' },
      { n: 'Stanford Math Tournament', d: 'Individual, Calculus and Algebra', v: 90, l: 'Top 10%' },
      { n: 'Caltech Math Tournament 2025', d: '', v: 75, l: 'Top 25%' },
      { n: 'M(IT)², MIT', d: 'Advanced division', v: 75, l: 'Top 25%' },
      { n: 'ProCo, Stanford', d: 'Programming', v: 75, l: 'Top 25%' },
    ];
    let h = '<div class="bar-rows ladder-rows">';
    rows.forEach((r, i) => (h += `<div class="bar-row hl"><span class="bar-label">${r.n}${r.d ? `<em>${r.d}</em>` : ''}</span><span class="bar-track"><span class="bar-fill" style="width:${r.v}%;--i:${i}"></span></span><span class="bar-val">${r.l}</span></div>`));
    h += '</div><div class="ladder-axis"><span>0%</span><span>50%</span><span>100% of the field</span></div>';
    ladder.innerHTML = h;
    const lr = ladder.querySelector('.bar-rows');
    grow(lr, 0.4);
  }
  const dots = $('#hack-dots');
  if (dots) {
    const wins = new Set([2, 7, 11, 15, 18]);
    dots.innerHTML = Array.from({ length: 20 }, (_, i) => `<i class="${wins.has(i) ? 'win' : ''}" style="--i:${i}"></i>`).join('');
    grow(dots, 0.6);
  }
})();
