/* Fig. 6. Two CubeSats over Earth, in three.js.
   Scroll zooms from a view of Earth to a chase view of the pair. The inset plots where the
   follower is, seen from the leader. Drag control on: a bounded 2:1 ellipse. Off: it drifts away. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const root = document.getElementById('fig6');
if (root) init();

function init() {
  const canvas = root.querySelector('canvas');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); }
  catch (e) { root.classList.add('no-3d'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x0b1020, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.005, 100);

  // Stars
  {
    const n = 900, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 20); pos.set([v.x, v.y, v.z], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xc8d2ff, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.8 })));
  }
  // Earth, painted on a canvas so nothing loads from outside
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d');
    const sea = x.createLinearGradient(0, 0, 0, 512); sea.addColorStop(0, '#1B3570'); sea.addColorStop(0.5, '#2450A8'); sea.addColorStop(1, '#1B3570');
    x.fillStyle = sea; x.fillRect(0, 0, 1024, 512);
    let s = 7; const R = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    const land = ['#3F8F6E', '#4C9A72', '#5DA57A', '#8DB07A'];
    for (let k = 0; k < 9; k++) { // continents as clusters of blobs
      const cx = R() * 1024, cy = 120 + R() * 280, n = 40 + Math.floor(R() * 60);
      for (let j = 0; j < n; j++) { x.fillStyle = land[Math.floor(R() * land.length)]; x.beginPath(); x.ellipse(cx + (R() - 0.5) * 220, cy + (R() - 0.5) * 120, 10 + R() * 40, 8 + R() * 26, R() * 3, 0, Math.PI * 2); x.fill(); }
    }
    x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(0, 0, 1024, 26); x.fillRect(0, 486, 1024, 26);
    x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 1;
    for (let i = 1; i < 12; i++) { x.beginPath(); x.moveTo(0, i * 512 / 12); x.lineTo(1024, i * 512 / 12); x.stroke(); }
    for (let i = 0; i < 24; i++) { x.beginPath(); x.moveTo(i * 1024 / 24, 0); x.lineTo(i * 1024 / 24, 512); x.stroke(); }
    for (let k = 0; k < 140; k++) { x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.ellipse(R() * 1024, 60 + R() * 390, 20 + R() * 60, 4 + R() * 8, R() * 0.6, 0, Math.PI * 2); x.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0 }));
  scene.add(earth);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.07, 64, 48), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.2); gl_FragColor = vec4(0.35, 0.55, 1.0, f * 0.9); }',
  }));
  scene.add(atmo);
  const sun = new THREE.DirectionalLight(0xffffff, 2.6); sun.position.set(5, 2.5, 4); scene.add(sun);
  scene.add(new THREE.AmbientLight(0x6878b0, 0.45));

  // Orbit
  const r0 = 1.34, inc = 0.5, n0 = reduce ? 0 : 0.16;
  const orbitPts = []; for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; orbitPts.push(new THREE.Vector3(Math.cos(a) * r0, Math.sin(a) * r0 * Math.sin(inc), Math.sin(a) * r0 * Math.cos(inc))); }
  const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts), new THREE.LineDashedMaterial({ color: 0x8fa2d8, dashSize: 0.03, gapSize: 0.025, transparent: true, opacity: 0.55 }));
  orbit.computeLineDistances(); scene.add(orbit);

  function sat(panel) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.024), new THREE.MeshStandardMaterial({ color: 0xdfe3ea, metalness: 0.6, roughness: 0.35 }));
    const pm = new THREE.MeshStandardMaterial({ color: panel, metalness: 0.3, roughness: 0.4, emissive: panel, emissiveIntensity: 0.35 });
    [-1, 1].forEach((s) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.001, 0.016), pm); p.position.x = s * 0.023; g.add(p); });
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.016), new THREE.MeshStandardMaterial({ color: 0xffffff })); ant.position.y = 0.014; g.add(ant);
    g.add(body); return g;
  }
  const leader = sat(0x2b3fe0), follower = sat(0x16a3a8);
  scene.add(leader, follower);
  const tether = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.008, gapSize: 0.006, transparent: true, opacity: 0.7 }));
  scene.add(tether);

  // UI
  const tagL = root.querySelector('[data-tag="leader"]'), tagF = root.querySelector('[data-tag="follower"]'), status = root.querySelector('.f6-status');
  const btnOn = root.querySelector('[data-ctl="on"]'), btnOff = root.querySelector('[data-ctl="off"]');
  const trail = root.querySelector('.f6-trail'), dot = root.querySelector('.f6-dot');
  let control = true, touched = false, drift = 0, ph = 0, hist = [];
  function setControl(v, user) {
    if (user) touched = true;
    control = v; btnOn.setAttribute('aria-checked', String(v)); btnOff.setAttribute('aria-checked', String(!v));
    status.textContent = v ? 'Drag control on: holding formation' : 'Drag control off: drifting apart';
    status.classList.toggle('warn', !v);
  }
  btnOn.addEventListener('click', () => setControl(true, true));
  btnOff.addEventListener('click', () => setControl(false, true));
  setControl(true);

  // scroll → zoom
  let zoom = 0;
  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: root, start: 'top 85%', end: 'center 45%', scrub: 0.6, onUpdate: (s) => (zoom = s.progress), onRefresh: (s) => (zoom = s.progress) });
  } else zoom = 1;

  let W = 1, H = 1;
  function resize() { W = canvas.clientWidth; H = canvas.clientHeight; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(canvas); resize();

  const v = new THREE.Vector3(), rhat = new THREE.Vector3(), that = new THREE.Vector3(), nhat = new THREE.Vector3();
  const wideCam = new THREE.Vector3(0.6, 1.1, 4.1), camPos = new THREE.Vector3(), look = new THREE.Vector3(), chase = new THREE.Vector3();
  let t = 0, demoT = 0;
  const ease = (x) => x * x * (3 - 2 * x);
  function project(p, el) {
    v.copy(p).project(camera);
    const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
    el.style.opacity = vis ? '1' : '0';
    el.style.transform = `translate(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * H}px)`;
  }
  function frame(dt) {
    t += dt; ph += dt * 0.9;
    // demo: alternate control until the visitor uses the toggle
    if (!touched && !reduce) { demoT += dt; if (demoT > 7) { demoT = 0; setControl(!control); } }
    drift = control ? Math.max(0, drift - dt * 0.12) : drift + dt * 0.06;
    if (drift > 0.5) drift = 0;
    const th = 1.2 + t * n0;
    const lp = new THREE.Vector3(Math.cos(th) * r0, Math.sin(th) * r0 * Math.sin(inc), Math.sin(th) * r0 * Math.cos(inc));
    rhat.copy(lp).normalize(); that.set(-Math.sin(th), Math.cos(th) * Math.sin(inc), Math.cos(th) * Math.cos(inc)).normalize(); nhat.crossVectors(rhat, that);
    const a = 0.045, xr = a * Math.cos(ph), ya = -2 * a * Math.sin(ph) - drift; // radial, along-track
    leader.position.copy(lp); leader.lookAt(lp.clone().add(that)); leader.rotateY(Math.PI / 2);
    follower.position.copy(lp).addScaledVector(rhat, xr).addScaledVector(that, ya); follower.quaternion.copy(leader.quaternion);
    tether.geometry.attributes.position.setXYZ(0, lp.x, lp.y, lp.z); tether.geometry.attributes.position.setXYZ(1, follower.position.x, follower.position.y, follower.position.z);
    tether.geometry.attributes.position.needsUpdate = true; tether.computeLineDistances();
    earth.rotation.y += dt * 0.02;
    // camera: from a wide view of Earth to a chase view behind the pair
    const z = ease(zoom);
    chase.copy(lp).addScaledVector(rhat, 0.2).addScaledVector(that, 0.34).addScaledVector(nhat, 0.16);
    camPos.copy(wideCam).lerp(chase, z);
    look.set(0, 0, 0).lerp(lp.clone().addScaledVector(that, -0.02).addScaledVector(rhat, 0.01), z);
    camera.position.copy(camPos); camera.lookAt(look);
    renderer.render(scene, camera);
    project(lp, tagL); project(follower.position, tagF);
    // inset: follower seen from the leader (along-track →, radial ↑)
    hist.push([ya, xr]); if (hist.length > 260) hist.shift();
    const sx = (y) => 110 - y * 620, sy = (x) => 60 - x * 620;
    trail.setAttribute('points', hist.map(([y, x]) => `${sx(y).toFixed(1)},${sy(x).toFixed(1)}`).join(' '));
    dot.setAttribute('cx', sx(ya).toFixed(1)); dot.setAttribute('cy', sy(xr).toFixed(1));
  }
  let raf = 0, last = 0;
  const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; frame(dt); raf = requestAnimationFrame(loop); };
  if (reduce) { frame(0.016); new ResizeObserver(() => frame(0)).observe(canvas); return; }
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf = 0; } }), { threshold: 0.02 }).observe(root);
  frame(0.016);
}
