/* ------------------------------------------------------------------
   Links. Entries with an empty href are hidden.
------------------------------------------------------------------ */
const LINKS = [
  { label: 'GitHub', href: 'https://github.com/pranayrishi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rishi-nalem-8161b7244/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@programmingwithrishinalem' },
  { label: 'Medium', href: 'https://medium.com/@pranayrishi.nalem' },
  { label: 'Task Matrices on OpenReview', href: 'https://openreview.net/forum?id=wCm3TFLNwr' },
  { label: 'Google Scholar', href: '' },
  { label: 'CV (PDF)', href: '' },
];
const EMAIL = 'pranayrishi.nalem@gmail.com';
const BUILDS = [
  { title: 'AI-powered robot arm', year: '2023', stack: 'Arduino, Raspberry Pi, computer vision', img: 'assets/img/robot-arm.webp', desc: 'A robot arm on a wheeled base, guided by computer vision, with an Arduino driving the motors and a Raspberry Pi handling the vision. The video walks through the build end to end.', video: 'https://www.youtube.com/watch?v=CBZo3_qBZF0' },
  { title: 'Caesar cipher on micro:bit', year: '2023', stack: 'BBC micro:bit, cryptography', img: 'assets/img/microbit-cipher.webp', desc: 'A pair of BBC micro:bits that encrypt and decrypt messages with a Caesar cipher.', video: 'https://www.youtube.com/watch?v=bIt3S9f6cc0' },
  { title: 'Dillman’s Antiquities app', year: '2023', stack: 'Flutter, Dart', img: 'assets/img/dillmans-app.webp', desc: 'A Flutter mobile marketplace app built for Dillman’s Antiquities.', video: 'https://www.youtube.com/watch?v=5Q0CJFjN8Tc' },
  { title: 'Voice-controlled Pong', year: '2022', stack: 'JavaScript, Alan AI', img: 'assets/img/voice-pong.webp', desc: 'A Pong game you play with your voice, built at Alan AI for children with disabilities.', video: 'https://www.youtube.com/watch?v=ODQWSnVnlJk' },
  { title: 'GitHub FAQ bot', year: '2022', stack: 'Alan AI, GitHub API', img: 'assets/img/github-faq.webp', desc: 'A voice assistant layered over a GitHub FAQ page that answers questions about GitHub, built with Alan AI and the GitHub API.', video: 'https://www.youtube.com/watch?v=w79sVJ-q-Tc' },
  { title: 'Smart health survey', year: '2022', stack: 'Algorithm design, data analysis', img: 'assets/img/health-survey.webp', desc: 'A health survey for Hella Healthy Essentials that turns your answers into personalized product recommendations.', video: 'https://www.youtube.com/watch?v=bBYx4afhzqA' },
];

(function () {
  const html = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePtr = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const F = (window.FIELD = window.FIELD || {});
  Object.assign(F, {
    intro: reduce ? 1 : 0, t: 0, mix: 0, shift: 0, tree: 0, horizon: 0.5, fadeOut: 0, fadeIn: 0, reduce,
    T: [1.42, -0.38, 0.12, 0.21, 0.78, -0.30, -0.08, 0.27, 0.92],
  });

  if (!isMac) { $('#kbd-hint').textContent = 'Ctrl K'; $$('footer kbd')[0].textContent = 'Ctrl'; }
  if (finePtr) $('#hint').innerHTML = 'Move through the cloud to find nearest neighbours, then scroll to apply <i>T</i>.';

  /* ---------------- Toasts ---------------- */
  const toaster = $('#toaster');
  const toasts = [];
  const CHECK = '<svg viewBox="0 0 10 10" fill="none" stroke="#fff" stroke-width="1.8"><path d="M2 5.2l2 2L8 3"/></svg>';
  const BANG = '<svg viewBox="0 0 10 10" fill="none" stroke="#fff" stroke-width="1.8"><path d="M5 2v3.6M5 7.6v.2"/></svg>';
  function layoutToasts() { toasts.forEach((t, i) => { const k = toasts.length - 1 - i; t.el.style.setProperty('--i', k); t.el.dataset.hidden = k > 2 ? 'true' : 'false'; }); }
  function toast(title, desc, err) {
    const el = document.createElement('li');
    el.className = 'toast'; el.dataset.state = 'enter'; el.setAttribute('role', 'status');
    el.innerHTML = `<span class="ic${err ? ' err' : ''}">${err ? BANG : CHECK}</span><div><b></b><span></span></div>`;
    el.querySelector('b').textContent = title; el.querySelector('div span').textContent = desc || '';
    toaster.appendChild(el);
    const t = { el, timer: null };
    toasts.push(t); layoutToasts();
    requestAnimationFrame(() => requestAnimationFrame(() => { el.dataset.state = 'open'; }));
    const dismiss = () => {
      el.dataset.state = 'exit';
      setTimeout(() => { el.remove(); const i = toasts.indexOf(t); if (i > -1) toasts.splice(i, 1); layoutToasts(); }, 240);
    };
    const arm = () => { t.timer = setTimeout(dismiss, 3400); };
    el.addEventListener('pointerenter', () => clearTimeout(t.timer));
    el.addEventListener('pointerleave', arm);
    arm();
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e2) { return false; }
    }
  }
  async function copyEmail() { const ok = await copyText(EMAIL); ok ? toast('Email copied', EMAIL) : toast('Couldn’t copy', 'Select the address and copy it yourself.', true); }
  $('#copy-email').addEventListener('click', copyEmail);

  /* ---------------- Easiest-first decoder (name, headings, Fig. 4) ---------------- */
  function greedyOrder(base, w) {
    const n = base.length, rev = new Array(n).fill(false), out = [];
    const conf = (i) => { let c = base[i]; for (let j = 0; j < n; j++) if (rev[j]) { const d = Math.abs(i - j); if (d < w.length) c += w[d]; } return Math.min(0.98, c); };
    for (let s = 0; s < n; s++) {
      let pick = -1, best = -1;
      for (let i = 0; i < n; i++) if (!rev[i]) { const c = conf(i); if (c > best + 1e-9) { best = c; pick = i; } }
      out.push({ i: pick, c: best }); rev[pick] = true;
    }
    return out;
  }
  function leftToRight(base, w) {
    const n = base.length, rev = new Array(n).fill(false), out = [];
    for (let i = 0; i < n; i++) {
      let c = base[i];
      for (let j = 0; j < n; j++) if (rev[j]) { const d = Math.abs(i - j); if (d < w.length) c += w[d]; }
      out.push({ i, c: Math.min(0.98, c) }); rev[i] = true;
    }
    return out;
  }

  /* ---------------- Masked letters: name + section headings ---------------- */
  const FREQ = { e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0, d: 4.3, l: 4.0, c: 2.8, u: 2.8, m: 2.4, w: 2.4, f: 2.2, g: 2.0, y: 2.0, p: 1.9, b: 1.5, v: 1.0, k: 0.8 };
  function splitLetters(el) {
    const chars = [];
    const lines = el.querySelectorAll('.line').length ? el.querySelectorAll('.line') : [el];
    lines.forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = '';
      words.forEach((w, wi) => {
        const ws = document.createElement('span'); ws.className = 'word'; ws.setAttribute('aria-hidden', 'true');
        [...w].forEach((ch) => {
          const s = document.createElement('span'); s.className = 'ch';
          const g = document.createElement('span'); g.className = 'g'; g.textContent = ch;
          s.appendChild(g); ws.appendChild(s); chars.push({ el: s, ch });
        });
        line.appendChild(ws);
        if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    });
    return chars;
  }
  function revealLetters(el, chars, start, step, done) {
    const base = chars.map(({ ch }) => 0.12 + ((FREQ[ch.toLowerCase()] || 0.5) / 12.7) * 0.6 * (ch === ch.toUpperCase() ? 0.55 : 1));
    const order = greedyOrder(base, [0, 0.16, 0.06]);
    chars.forEach((c) => c.el.classList.remove('on'));
    el.classList.add('masking');
    order.forEach(({ i }, k) => setTimeout(() => chars[i].el.classList.add('on'), start + k * step));
    setTimeout(() => { el.classList.remove('masking'); if (done) done(); }, start + order.length * step + 460);
  }
  const nameEl = $('#name');
  const nameChars = splitLetters(nameEl);
  nameEl.classList.add('split');
  if (html.classList.contains('intro')) revealLetters(nameEl, nameChars, 380, 70, () => html.classList.remove('intro'));
  function replayName() { if (reduce) return; window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => revealLetters(nameEl, nameChars, 200, 70), 500); }

  if (!reduce && 'IntersectionObserver' in window) {
    $$('.mask-h').forEach((h) => {
      h.setAttribute('aria-label', h.textContent.trim());
      const chars = splitLetters(h);
      const r = h.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: leave it alone
      h.classList.add('masking');
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { io.disconnect(); revealLetters(h, chars, 60, 48); }
      }), { threshold: 0.6 });
      io.observe(h);
      setTimeout(() => { if (h.classList.contains('masking') && h.getBoundingClientRect().top < 0) { io.disconnect(); h.classList.remove('masking'); } }, 2500);
    });
  }

  /* ---------------- Fig. 1 matrix ---------------- */
  const matrixEl = $('#matrix');
  const cells = [];
  for (let k = 0; k < 9; k++) { const c = document.createElement('span'); c.className = 'cell' + (k % 4 === 0 ? ' diag' : ''); matrixEl.appendChild(c); cells.push(c); }
  let lastT = -1;
  function renderMatrix() {
    const t = Math.round(F.t * 100) / 100;
    if (t === lastT) return; lastT = t;
    for (let k = 0; k < 9; k++) {
      const id = k % 4 === 0 ? 1 : 0, v = id + (F.T[k] - id) * t;
      cells[k].textContent = (Math.abs(v) < 0.005 ? 0 : v).toFixed(2).replace('-', '−');
      cells[k].classList.toggle('lit', t > 0.02);
    }
  }
  renderMatrix();

  /* ---------------- Fig. 3 rollout frames ---------------- */
  const CURSOR = [[16, 9], [20, 27], [26, 39], [70, 52], [96, 54], [104, 54], [109, 68], [124, 62], [128, 76]];
  function ui(s) {
    let g = '<rect class="sv-bar" x="1" y="1" width="158" height="13" rx="5"/>';
    g += '<rect class="sv-line" x="9" y="5.5" width="13" height="4" rx="2"/><rect class="sv-line" x="27" y="5.5" width="11" height="4" rx="2"/><rect class="sv-line" x="43" y="5.5" width="13" height="4" rx="2"/>';
    for (let k = 0; k < 6; k++) g += `<rect class="sv-line" x="8" y="${22 + k * 9}" width="${k % 2 ? 20 : 26}" height="3.5" rx="1.75"/>`;
    g += '<rect class="sv-bar" x="46" y="21" width="106" height="40" rx="3"/>';
    g += '<rect class="sv-line" x="46" y="68" width="92" height="3.5" rx="1.75"/><rect class="sv-line" x="46" y="76" width="70" height="3.5" rx="1.75"/><rect class="sv-line" x="46" y="84" width="82" height="3.5" rx="1.75"/>';
    if (s === 0) g += '<rect class="sv-accsoft" x="6" y="3" width="19" height="9" rx="3"/>';
    if (s === 1 || s === 2) {
      g += '<rect class="sv-soft" x="7" y="16" width="48" height="40" rx="3"/><rect class="sv-bg" x="6" y="15" width="48" height="40" rx="3" stroke="#C7CCD5" stroke-width=".8"/>';
      for (let k = 0; k < 4; k++) {
        if (s === 2 && k === 2) g += `<rect class="sv-acc" x="9" y="${19 + k * 9}" width="42" height="7" rx="2"/>`;
        g += `<rect class="${s === 2 && k === 2 ? 'sv-bg' : 'sv-line'}" x="13" y="${21 + k * 9}" width="${[24, 18, 28, 20][k]}" height="3" rx="1.5"/>`;
      }
    }
    if (s >= 3 && s <= 6) {
      g += '<rect class="sv-soft" x="1" y="1" width="158" height="102" rx="5"/><rect class="sv-bg" x="34" y="28" width="92" height="50" rx="4" stroke="#C7CCD5" stroke-width=".8"/>';
      g += '<rect class="sv-ink" x="42" y="35" width="34" height="4" rx="2"/><rect class="sv-bg" x="42" y="45" width="76" height="11" rx="2" stroke="#9AA2B1" stroke-width=".8"/>';
      const typed = [0, 26, 52, 52][s - 3];
      if (typed) g += `<rect class="sv-ink" x="46" y="49" width="${typed}" height="3" rx="1.5" opacity=".75"/>`;
      if (s === 3) g += '<rect class="sv-acc" x="46" y="47.5" width="1.2" height="6"/>';
      g += `<rect class="sv-line" x="74" y="63" width="20" height="9" rx="2"/><rect class="sv-acc" x="98" y="63" width="20" height="9" rx="2" ${s === 6 ? 'opacity=".75"' : ''}/><rect class="sv-bg" x="102" y="66.5" width="12" height="2" rx="1"/>`;
    }
    if (s === 7) g += '<rect class="sv-line" x="46" y="94" width="106" height="4" rx="2"/><rect class="sv-acc" x="46" y="94" width="64" height="4" rx="2"/>';
    if (s === 8) g += '<rect class="sv-ink" x="100" y="86" width="54" height="13" rx="4"/><rect class="sv-acc" x="105" y="90.5" width="4" height="4" rx="2"/><rect class="sv-bg" x="113" y="91" width="30" height="3" rx="1.5"/>';
    const [cx, cy] = CURSOR[s];
    return g + `<path class="sv-cursor" d="M${cx} ${cy} l0 9.5 l2.6 -2.3 l2 4.4 l1.8 -0.8 l-2 -4.3 l3.6 -0.3 z"/>`;
  }
  const framesEl = $('#frames');
  const frames = [];
  for (let s = 0; s < 9; s++) {
    const d = document.createElement('div');
    d.className = 'frame' + (s ? ' predicted' : '');
    d.innerHTML = `<svg viewBox="0 0 160 104" role="img" aria-label="${s ? 'Predicted screen, step ' + s : 'Observed screen'}"><rect class="sv-bg" x=".5" y=".5" width="159" height="103" rx="5"/><g class="ghost">${ui(s)}</g><g class="ui">${ui(s)}</g><rect class="sv-frame" x=".5" y=".5" width="159" height="103" rx="5"/></svg><div class="frame-label"><span class="t">${s ? 't + ' + s : 'Observed'}</span><span class="drift-note">Drifting</span></div>`;
    framesEl.appendChild(d); frames.push(d);
  }
  const DRIFT = { single: [0, 0, 0, 0, 0, 0.32, 0.56, 0.8, 1], multi: [0, 0, 0, 0, 0, 0, 0, 0, 0.1] };
  const segSingle = $('#obj-single'), segMulti = $('#obj-multi');
  let mode = 'single', touched = false;
  function setMode(m, stagger) {
    mode = m;
    segSingle.setAttribute('aria-checked', String(m === 'single'));
    segMulti.setAttribute('aria-checked', String(m === 'multi'));
    frames.forEach((f, i) => {
      f.style.transitionDelay = stagger ? Math.max(0, i - 4) * 70 + 'ms' : '0ms';
      f.style.setProperty('--d', DRIFT[m][i]);
      f.classList.toggle('drifting', DRIFT[m][i] > 0.2);
    });
  }
  setMode('single', false);
  segSingle.addEventListener('click', () => { touched = true; setMode('single', true); });
  segMulti.addEventListener('click', () => { touched = true; setMode('multi', true); });
  [segSingle, segMulti].forEach((b) => b.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); touched = true;
      const next = mode === 'single' ? 'multi' : 'single';
      setMode(next, true); (next === 'single' ? segSingle : segMulti).focus();
    }
  }));
  if (!hasGSAP && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { io.disconnect(); setTimeout(() => { if (!touched) setMode('multi', true); }, reduce ? 0 : 900); }
    }), { threshold: 0.55 });
    io.observe(framesEl);
  }

  /* ---------------- Fig. 4 decoder ---------------- */
  const STOP = new Set('the a an of to and in is it that for on with as at by be this are was from or but not you i we they he she my your its can will do does if so than then there their what when which who how all just into out up about more before after next last our his her them me us one has have had'.split(' '));
  const WTS = [0, 0.3, 0.12, 0.05];
  const hash = (w) => { let h = 2166136261; for (const c of w) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; };
  const PRESET = { 'the agent predicts the next screen before it clicks': [0.7, 0.06, 0.18, 0.83, 0.43, 0.09, 0.42, 0.8, 0.28] };
  function confidences(words) {
    const key = words.join(' ');
    if (PRESET[key]) return PRESET[key];
    return words.map((w) => STOP.has(w) ? 0.6 + 0.24 * hash(w) : Math.max(0.04, Math.min(0.48, 0.52 - 0.045 * w.length + 0.14 * hash(w))));
  }
  const tokEl = $('#tokens'), sentence = $('#sentence');
  const btnL = $('#dec-ltr'), btnA = $('#dec-adapt');
  const readRows = $$('#readout > div');
  let words = [], toks = [], plans = {}, running = false, runTimers = [], scrollDecode = true;
  const stats = (p) => ({ mean: p.reduce((a, b) => a + b.c, 0) / p.length, min: Math.min(...p.map((x) => x.c)) });
  function setTok(i, n, c) {
    const t = toks[i]; if (!t) return;
    t.querySelector('.n').textContent = n;
    t.style.setProperty('--c', c.toFixed(3));
    t.classList.toggle('low', c < 0.5);
    t.classList.remove('masked');
  }
  function build(text) {
    runTimers.forEach(clearTimeout); runTimers = []; running = false; btnL.disabled = btnA.disabled = false;
    words = text.toLowerCase().replace(/[^a-z0-9'’\s-]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 14);
    if (!words.length) words = ['type', 'a', 'sentence', 'above'];
    const base = confidences(words);
    plans = { ltr: leftToRight(base, WTS), adapt: greedyOrder(base, WTS) };
    ['ltr', 'adapt'].forEach((m) => { const s = stats(plans[m]); $('#' + m + '-mean').textContent = s.mean.toFixed(2); $('#' + m + '-min').textContent = s.min.toFixed(2); });
    tokEl.textContent = '';
    toks = words.map((w) => { const t = document.createElement('span'); t.className = 'tok masked'; t.innerHTML = '<span class="n"></span><span class="w"></span><span class="m"></span><span class="c"><i></i></span>'; t.querySelector('.w').textContent = w; tokEl.appendChild(t); return t; });
    plans.adapt.forEach(({ i, c }, k) => setTok(i, k + 1, c));
    readRows.forEach((r) => r.classList.toggle('is-current', r.dataset.mode === 'adapt'));
  }
  function run(m) {
    if (running) return; running = true; scrollDecode = false;
    btnL.disabled = btnA.disabled = true;
    readRows.forEach((r) => r.classList.toggle('is-current', r.dataset.mode === m));
    toks.forEach((t) => t.classList.add('masked'));
    const gap = reduce ? 0 : Math.max(200, Math.min(340, 3000 / words.length));
    plans[m].forEach(({ i, c }, k) => runTimers.push(setTimeout(() => setTok(i, k + 1, c), (reduce ? 0 : 260) + k * gap)));
    runTimers.push(setTimeout(() => { running = false; btnL.disabled = btnA.disabled = false; }, (reduce ? 0 : 260) + words.length * gap + 120));
  }
  build(sentence.value);
  let typeTimer;
  sentence.addEventListener('input', () => { scrollDecode = false; clearTimeout(typeTimer); typeTimer = setTimeout(() => build(sentence.value), 260); });
  sentence.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); build(sentence.value); run('adapt'); } });
  $$('#chips .chip').forEach((c) => c.addEventListener('click', () => { sentence.value = c.textContent; build(c.textContent); run('adapt'); }));
  btnL.addEventListener('click', () => run('ltr'));
  btnA.addEventListener('click', () => run('adapt'));

  /* ---------------- SattvaAI illustration ---------------- */
  const agentDemo = $('#agent-demo'), typedEl = $('#agent-typed'), agentSteps = $$('#agent-steps li');
  const fullCmd = typedEl.textContent;
  let agentTimers = [];
  function playAgent() {
    if (reduce) return;
    agentTimers.forEach(clearTimeout); agentTimers = [];
    typedEl.textContent = ''; agentSteps.forEach((li) => (li.dataset.state = 'idle'));
    agentDemo.classList.add('typing');
    let t = 200;
    [...fullCmd].forEach((ch, k) => { agentTimers.push(setTimeout(() => { typedEl.textContent = fullCmd.slice(0, k + 1); }, t)); t += 24 + (ch === ' ' ? 30 : 0); });
    t += 380;
    agentTimers.push(setTimeout(() => agentDemo.classList.remove('typing'), t));
    agentSteps.forEach((li) => {
      agentTimers.push(setTimeout(() => (li.dataset.state = 'run'), t)); t += 640;
      agentTimers.push(setTimeout(() => (li.dataset.state = 'done'), t)); t += 120;
    });
  }
  $('#agent-replay').addEventListener('click', playAgent);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); playAgent(); } }), { threshold: 0.6 });
    io.observe(agentDemo);
  }

  /* ---------------- Archive + drawer ---------------- */
  const archive = $('#archive');
  BUILDS.forEach((b, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" aria-haspopup="dialog"><span class="yr">${b.year}</span><span class="ttl"></span><span class="stk"></span><span class="open">Details</span></button>`;
    li.querySelector('.ttl').textContent = b.title; li.querySelector('.stk').textContent = b.stack;
    li.querySelector('button').addEventListener('click', (e) => openDrawer(i, e.currentTarget));
    archive.appendChild(li);
  });
  // Photo that follows the cursor over the archive (pointer devices only)
  if (finePtr && !reduce) {
    const peek = $('#peek'); let px = 0, py = 0, tx = 0, ty = 0, raf = 0, on = false;
    BUILDS.forEach((b) => { const i = new Image(); i.src = b.img; });
    const loop = () => { px += (tx - px) * 0.18; py += (ty - py) * 0.18; peek.style.translate = `${px}px ${py}px`; raf = on || Math.abs(tx - px) > 0.5 ? requestAnimationFrame(loop) : 0; };
    $$('#archive button').forEach((btn, i) => {
      btn.addEventListener('pointerenter', (e) => { peek.src = BUILDS[i].img; if (!on) { px = tx = e.clientX + 24; py = ty = e.clientY - 90; } on = true; peek.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); });
      btn.addEventListener('pointermove', (e) => { tx = e.clientX + 24; ty = e.clientY - 90; });
      btn.addEventListener('pointerleave', () => { on = false; peek.classList.remove('on'); });
      btn.addEventListener('click', () => { on = false; peek.classList.remove('on'); });
    });
  }
  const drawer = $('#drawer'), dPanel = $('#drawer-panel'), dBody = $('#drawer-body');
  let dIndex = 0, lastFocus = null;
  function fillDrawer(i) {
    const b = BUILDS[i];
    $('#drawer-meta').textContent = `Earlier build ${i + 1} of ${BUILDS.length}`;
    $('#drawer-title').textContent = b.title; $('#drawer-desc').textContent = b.desc;
    $('#drawer-stack').textContent = b.stack; $('#drawer-year').textContent = b.year;
    $('#drawer-link').href = b.video;
    const img = $('#drawer-img'); img.src = b.img; img.alt = 'Photo of ' + b.title;
    const p = BUILDS[(i - 1 + BUILDS.length) % BUILDS.length], n = BUILDS[(i + 1) % BUILDS.length];
    $('#drawer-prev').innerHTML = 'Previous<b></b>'; $('#drawer-prev b').textContent = p.title;
    $('#drawer-next').innerHTML = 'Next<b></b>'; $('#drawer-next b').textContent = n.title;
  }
  function swapDrawer(i) {
    dIndex = (i + BUILDS.length) % BUILDS.length;
    if (reduce) { fillDrawer(dIndex); return; }
    dBody.classList.add('swap');
    setTimeout(() => { fillDrawer(dIndex); dBody.classList.remove('swap'); }, 160);
  }
  function openLayer(layer) {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (sw > 0) document.body.style.paddingRight = sw + 'px';
    layer.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (layer.dataset.state = 'open')));
  }
  function closeLayer(layer, after) {
    layer.dataset.state = 'closed';
    setTimeout(() => { layer.hidden = true; document.documentElement.style.overflow = ''; document.body.style.paddingRight = ''; if (after) after(); }, reduce ? 0 : 320);
  }
  function openDrawer(i, from) {
    lastFocus = from || document.activeElement;
    dIndex = i; fillDrawer(i); openLayer(drawer);
    setTimeout(() => dPanel.focus(), 60);
  }
  function closeDrawer() { closeLayer(drawer, () => { if (lastFocus) lastFocus.focus(); }); dPanel.style.transform = ''; }
  $$('#drawer [data-close]').forEach((el) => el.addEventListener('click', closeDrawer));
  $('#drawer-prev').addEventListener('click', () => swapDrawer(dIndex - 1));
  $('#drawer-next').addEventListener('click', () => swapDrawer(dIndex + 1));
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); }
    else if (e.key === 'ArrowLeft') swapDrawer(dIndex - 1);
    else if (e.key === 'ArrowRight') swapDrawer(dIndex + 1);
    else if (e.key === 'Tab') trapFocus(e, dPanel);
  });
  function trapFocus(e, root) {
    const f = $$('a[href], button:not([disabled]), input', root).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  // Drag to dismiss (bottom sheet on small screens)
  (function () {
    const head = $('#drawer-head'), handle = $('.drawer-handle');
    let y0 = 0, t0 = 0, dy = 0, drag = false;
    const start = (e) => { if (window.innerWidth > 760 || e.target.closest('button')) return; drag = true; y0 = e.clientY; t0 = performance.now(); dy = 0; dPanel.classList.add('dragging'); dPanel.setPointerCapture(e.pointerId); };
    const move = (e) => { if (!drag) return; dy = Math.max(0, e.clientY - y0); dPanel.style.transform = `translateY(${dy}px)`; };
    const end = () => {
      if (!drag) return; drag = false; dPanel.classList.remove('dragging');
      const v = dy / Math.max(1, performance.now() - t0);
      if (dy > 120 || v > 0.5) closeDrawer(); else dPanel.style.transform = '';
    };
    [head, handle].forEach((el) => el.addEventListener('pointerdown', start));
    dPanel.addEventListener('pointermove', move); dPanel.addEventListener('pointerup', end); dPanel.addEventListener('pointercancel', end);
  })();

  /* ---------------- Command menu ---------------- */
  const cmdk = $('#cmdk'), cInput = $('#cmdk-input'), cList = $('#cmdk-list');
  const go = (sel) => () => { const el = $(sel); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
  const COMMANDS = [
    { group: 'Go to', label: 'Research', hint: 'Section', run: go('#research') },
    { group: 'Go to', label: 'Fig. 1  Task matrices', hint: 'NeurIPS 2025 workshop', run: go('#task-matrices'), keys: 'linear map finetuning' },
    { group: 'Go to', label: 'Fig. 2  Imagined futures', hint: 'World models', run: go('#futures'), keys: 'horizon rollout gwu' },
    { group: 'Go to', label: 'Fig. 3  Two world models', hint: 'World models', run: go('#world-models'), keys: 'iclr gui agents' },
    { group: 'Go to', label: 'Fig. 4  Masked diffusion decoder', hint: 'Yale', run: go('#masked-diffusion'), keys: 'tokens' },
    { group: 'Go to', label: 'All research projects by date', hint: 'Timeline', run: go('#glance'), keys: 'gantt overview' },
    { group: 'Go to', label: 'Fig. 5  Formal verification and Lean', hint: 'Capital One', run: go('#formal'), keys: 'theorem proving proof' },
    { group: 'Go to', label: 'Fig. 6  CubeSat formation control', hint: 'AAS/AIAA 2026', run: go('#cubesat'), keys: 'orbit satellite drag aerospace' },
    { group: 'Go to', label: 'Fig. 7  Proteins and radio waves', hint: 'CU Boulder', run: go('#biophysics'), keys: 'biophysics cancer cryptochrome fad' },
    { group: 'Go to', label: 'Fig. 8  Magnon dynamics', hint: 'UC San Diego', run: go('#magnons'), keys: 'crsbr spin wave physics' },
    { group: 'Go to', label: 'Fig. 9  MonoScan', hint: 'Notre Dame', run: go('#monoscan'), keys: 'wse2 monolayer microscopy 2d materials' },
    { group: 'Go to', label: 'Fig. 10  Spintronic reservoir computing', hint: 'Science fair', run: go('#reservoir'), keys: 'oommf mackey glass narma' },
    { group: 'Go to', label: 'Fig. 11  ASDRP projects', hint: '2023–2025', run: go('#asdrp'), keys: 'drones ros llm safety' },
    { group: 'Go to', label: 'Papers and reports', hint: 'Publications', run: go('#papers'), keys: 'publications aas neurips' },
    { group: 'Go to', label: 'Fig. 12  On the active rheology of cats', hint: 'For fun', run: go('#cats'), keys: 'cat liquid sink deborah satire' },
    { group: 'Go to', label: 'Building: SattvaAI and Nalem Study Circle', hint: 'Section', run: go('#building'), keys: 'startup nonprofit' },
    { group: 'Go to', label: 'Projects', hint: 'Section', run: go('#projects'), keys: 'hackathon memorymesh wayfinder speakscribe' },
    { group: 'Go to', label: 'Honors and education', hint: 'Section', run: go('#honors'), keys: 'awards math competitions hackathons' },
    { group: 'Go to', label: 'Path, 2018 to 2027', hint: 'Section', run: go('#path'), keys: 'timeline history teaching industry skills' },
    { group: 'Go to', label: 'Contact', hint: 'Section', run: go('#contact'), keys: 'email' },
    { group: 'Actions', label: 'Copy email address', hint: EMAIL, run: copyEmail },
    { group: 'Actions', label: 'Try your own sentence in the decoder', hint: 'Fig. 4', run: () => { go('#decoder')(); setTimeout(() => sentence.focus({ preventScroll: true }), reduce ? 0 : 700); }, keys: 'type masked' },
    { group: 'Actions', label: 'Replay the name reveal', hint: 'Top', run: replayName },
    ...BUILDS.map((b, i) => ({ group: 'Earlier builds', label: b.title, hint: b.year, run: () => { go('#archive')(); setTimeout(() => openDrawer(i), reduce ? 0 : 500); }, keys: b.stack })),
    ...LINKS.filter((l) => l.href).map((l) => ({ group: 'Links', label: l.label, hint: new URL(l.href).hostname.replace('www.', ''), href: l.href })),
    { group: 'Links', label: 'CubeSat paper (DOI)', hint: 'doi.org', href: 'https://doi.org/10.5281/zenodo.23369472' },
    { group: 'Links', label: 'SattvaAI', hint: 'sattva-ai-website.vercel.app', href: 'https://sattva-ai-website.vercel.app/' },
    { group: 'Links', label: 'Nalem Study Circle', hint: 'nalemstudycircle.org', href: 'https://nalemstudycircle.org' },
  ];
  let cResults = [], cActive = 0;
  function score(cmd, q) {
    if (!q) return 1;
    const hay = (cmd.label + ' ' + cmd.group + ' ' + (cmd.keys || '')).toLowerCase();
    if (cmd.label.toLowerCase().startsWith(q)) return 4;
    if (hay.includes(q)) return 3;
    let i = 0; for (const ch of hay) { if (ch === q[i]) i++; if (i === q.length) return 1; }
    return 0;
  }
  function renderCmdk() {
    const q = cInput.value.trim().toLowerCase();
    cResults = COMMANDS.map((c) => ({ c, s: score(c, q) })).filter((x) => x.s > 0);
    if (q) cResults.sort((a, b) => b.s - a.s);
    cList.textContent = '';
    if (!cResults.length) { cList.innerHTML = '<div class="cmdk-empty">No matches. Try “paper”, “email” or a project name.</div>'; cInput.removeAttribute('aria-activedescendant'); return; }
    const groups = q ? [['Results', cResults]] : [...new Set(cResults.map((r) => r.c.group))].map((g) => [g, cResults.filter((r) => r.c.group === g)]);
    let idx = 0; const ordered = [];
    groups.forEach(([g, items]) => {
      const gh = document.createElement('div'); gh.className = 'cmdk-group'; gh.textContent = g; cList.appendChild(gh);
      items.forEach(({ c }) => {
        const el = document.createElement(c.href ? 'a' : 'div');
        el.className = 'cmdk-item'; el.id = 'cmd-' + idx; el.setAttribute('role', 'option');
        if (c.href) { el.href = c.href; el.rel = 'noopener'; el.tabIndex = -1; }
        el.innerHTML = '<span></span><span class="hint"></span>';
        el.firstChild.textContent = c.label; el.lastChild.textContent = c.hint || '';
        const my = idx;
        el.addEventListener('pointermove', () => { if (cActive !== my) setActiveCmd(my, false); });
        el.addEventListener('click', (e) => { if (!c.href) e.preventDefault(); execCmd(c); });
        cList.appendChild(el); ordered.push(c); idx++;
      });
    });
    cResults = ordered; cActive = 0; setActiveCmd(0, true);
  }
  function setActiveCmd(i, scroll) {
    cActive = Math.max(0, Math.min(cResults.length - 1, i));
    $$('.cmdk-item', cList).forEach((el, k) => el.setAttribute('aria-selected', String(k === cActive)));
    const el = $('#cmd-' + cActive);
    if (el) { cInput.setAttribute('aria-activedescendant', el.id); if (scroll) el.scrollIntoView({ block: 'nearest' }); }
  }
  function execCmd(c) {
    if (c.href) { closeCmdk(false); return; } // the anchor navigates itself
    closeCmdk(false); setTimeout(() => c.run(), 60);
  }
  let cmdkFrom = null;
  function openCmdk() { if (!cmdk.hidden) return; cmdkFrom = document.activeElement; cInput.value = ''; renderCmdk(); openLayer(cmdk); setTimeout(() => cInput.focus(), 30); }
  function closeCmdk(restore = true) { if (cmdk.hidden) return; closeLayer(cmdk, () => { if (restore && cmdkFrom) cmdkFrom.focus(); }); }
  $('#open-cmdk').addEventListener('click', openCmdk);
  $$('#cmdk [data-close]').forEach((el) => el.addEventListener('click', () => closeCmdk()));
  cInput.addEventListener('input', renderCmdk);
  cInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveCmd(cActive + 1 >= cResults.length ? 0 : cActive + 1, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveCmd(cActive - 1 < 0 ? cResults.length - 1 : cActive - 1, true); }
    else if (e.key === 'Enter') { e.preventDefault(); const c = cResults[cActive]; if (!c) return; if (c.href) $('#cmd-' + cActive).click(); else execCmd(c); }
    else if (e.key === 'Escape') { e.preventDefault(); closeCmdk(); }
    else if (e.key === 'Tab') e.preventDefault();
  });
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.hidden ? openCmdk() : closeCmdk(); }
    else if (e.key === '/' && cmdk.hidden && drawer.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openCmdk(); }
  });

  /* ---------------- Contact links ---------------- */
  const linksEl = $('#links');
  LINKS.filter((l) => l.href).forEach((l) => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = l.href; a.rel = 'noopener'; a.textContent = l.label; li.appendChild(a); linksEl.appendChild(li); });

  /* ---------------- Nav ---------------- */
  const nav = $('#nav'), navLinks = $$('.nav-links a'), mark = $('.nav-mark');
  let active = null;
  function setActive(key) {
    if (key === active) return; active = key;
    const a = navLinks.find((l) => l.dataset.target === key);
    navLinks.forEach((l) => l.classList.toggle('is-active', l === a));
    if (!a) { mark.style.opacity = '0'; return; }
    mark.style.opacity = '1';
    mark.style.transform = `translateX(${a.offsetLeft}px) scaleX(${a.offsetWidth / 100})`;
  }
  const sections = $$('[data-nav]');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
    const y = window.innerHeight * 0.45; let key = 'top';
    sections.forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) key = s.dataset.nav; });
    setActive(key);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { const k = active; active = null; setActive(k); });
  onScroll();

  /* ---------------- Scroll choreography ---------------- */
  function stepper(listSel, cuts) {
    const steps = $$(listSel + ' .step'); let cur = 0;
    return (p) => { let k = 0; cuts.forEach((c, i) => { if (p >= c) k = i + 1; }); if (k === cur) return; cur = k; steps.forEach((s, i) => s.classList.toggle('is-active', i === k)); };
  }
  const step1 = stepper('#steps1', [0.28, 0.6]);
  const step2 = stepper('#steps2', [0.36, 0.66]);
  const years = $$('.year');

  if (!hasGSAP) {
    F.t = 1; F.mix = 1; renderMatrix();
    $$('.step').forEach((s) => s.classList.add('is-active'));
    years.forEach((y) => y.classList.add('is-now'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.ticker.add(renderMatrix);
  if (!reduce) gsap.to(F, { intro: 1, duration: 2.6, ease: 'expo.out', delay: 0.15 });

  gsap.to(F, { shift: 1, ease: 'none', scrollTrigger: { trigger: '#research', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

  gsap.timeline({ scrollTrigger: { trigger: '#task-matrices', start: 'top top', end: '+=230%', pin: true, scrub: 0.8, anticipatePin: 1, onUpdate: (s) => step1(s.progress) } })
    .to(F, { t: 1, duration: 1, ease: 'power2.inOut' }, 0.22)
    .to(F, { mix: 1, duration: 1.15, ease: 'power3.inOut' }, 0.42)
    .to({}, { duration: 0.35 });

  gsap.timeline({ scrollTrigger: { trigger: '#futures', start: 'top top', end: '+=260%', pin: true, scrub: 0.8, anticipatePin: 1, onUpdate: (s) => step2(s.progress) } })
    .fromTo(F, { tree: 0 }, { tree: 1, duration: 1, ease: 'power3.inOut', immediateRender: false }, 0.05)
    .to({}, { duration: 0.7 })
    .fromTo(F, { horizon: 0.5 }, { horizon: 1, duration: 0.9, ease: 'power2.inOut', immediateRender: false })
    .to({}, { duration: 0.35 });

  gsap.to(F, { fadeOut: 1, ease: 'none', scrollTrigger: { trigger: '#world-models', start: 'top 92%', end: 'top 35%', scrub: true } });

  // Fig. 3: the imagined screens appear one after another as the figure scrolls through
  if (!reduce) {
    const imagine = (st) => {
      const n = st.progress * (frames.length + 0.6);
      frames.forEach((f, i) => { f.style.setProperty('--show', Math.min(1, Math.max(0, n - i + 0.15)).toFixed(3)); f.classList.toggle('now', i === Math.floor(n) && n < frames.length); });
      if (st.progress > 0.9 && !touched && mode === 'single') setMode('multi', true);
    };
    ScrollTrigger.create({ trigger: '#frames', start: 'top 82%', end: 'bottom 50%', scrub: true, onUpdate: imagine, onRefresh: imagine });
  }
  // Fig. 4: the sentence decodes, easiest word first, as you scroll to it (until you use the controls)
  if (!reduce) {
    let lastK = -1;
    const decode = (st) => {
      if (!scrollDecode || running) return;
      const k = Math.round(st.progress * plans.adapt.length);
      if (k === lastK) return; lastK = k;
      toks.forEach((t) => t.classList.add('masked'));
      plans.adapt.slice(0, k).forEach(({ i, c }, n) => setTok(i, n + 1, c));
    };
    ScrollTrigger.create({ trigger: '#tokens', start: 'top 88%', end: 'top 40%', scrub: true, onUpdate: decode });
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const track = $('#htrack');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#hscroll', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    const setYear = (p) => { const idx = Math.round(p * (years.length - 1)); years.forEach((y, i) => { y.classList.toggle('is-now', i === idx); y.classList.toggle('is-past', i < idx); }); };
    ScrollTrigger.create({ trigger: '#hscroll', start: 'top top', end: () => '+=' + dist(), onUpdate: (st) => setYear(st.progress), onRefresh: (st) => setYear(st.progress) });
    setYear(0);
    return () => years.forEach((y) => y.classList.remove('is-now', 'is-past'));
  });
  mm.add('(max-width: 960px)', () => {
    years.forEach((y) => ScrollTrigger.create({ trigger: y, start: 'top 62%', end: 'bottom 62%', onToggle: (s) => y.classList.toggle('is-now', s.isActive), onLeave: () => y.classList.add('is-past'), onLeaveBack: () => y.classList.remove('is-past') }));
  });

  gsap.to(F, { fadeIn: 1, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 25%', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
