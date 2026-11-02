import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createChapters } from './chapters.js';

const F = window.FIELD;
const canvas = document.getElementById('field');
const probe = document.getElementById('probe');
const pctx = probe.getContext('2d');

function gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;

function init() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { canvas.style.display = 'none'; document.documentElement.classList.add('no-webgl'); return; }
  const PR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 7.6);

  const small = window.matchMedia('(max-width: 720px)').matches;
  const N = small ? 4200 : 9000;
  const K = 6;
  const PALETTE = ['#2B3FE0', '#0F7A84', '#6A44D6', '#1D2330', '#3B8EE0', '#7A88A4'].map((h) => new THREE.Color(h));

  const centres = [], axes = [];
  for (let k = 0; k < K; k++) {
    const y = 1 - (k + 0.5) * (2 / K), r = Math.sqrt(1 - y * y), th = k * 2.39996;
    centres.push(new THREE.Vector3(Math.cos(th) * r, y * 0.85, Math.sin(th) * r).multiplyScalar(1.22));
    axes.push(new THREE.Vector3(gauss(), gauss(), gauss()).normalize());
  }
  // Rollout tree: 3 first actions x 3 follow-ups = 9 imagined futures.
  const B1 = [[-0.78, 0.22], [0.02, -0.26], [0.8, 0.18]];
  const paths = [];
  B1.forEach(([y, z], i) => [-1, 0, 1].forEach((j) => paths.push([[y, z], [y + j * 0.44 + (i - 1) * 0.12, z + j * 0.18 * (i % 2 ? -1 : 1)]])));

  const base = new Float32Array(N * 3), fine = new Float32Array(N * 3), scatter = new Float32Array(N * 3);
  const color = new Float32Array(N * 3), rnd = new Float32Array(N);
  const b1 = new Float32Array(N * 2), b2 = new Float32Array(N * 2), jit = new Float32Array(N * 3), flow = new Float32Array(N);
  const v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const k = i % K, c = centres[k];
    v.set(gauss() * 0.64, gauss() * 0.5, gauss() * 0.58).addScaledVector(c, 0.3);
    const tw = v.length() * 0.9, cs = Math.cos(tw), sn = Math.sin(tw);
    base[i * 3] = v.x * cs - v.z * sn; base[i * 3 + 1] = v.y; base[i * 3 + 2] = v.x * sn + v.z * cs;
    const a = axes[k], along = gauss() * 0.26;
    fine[i * 3] = c.x + gauss() * 0.12 + a.x * along; fine[i * 3 + 1] = c.y + gauss() * 0.12 + a.y * along; fine[i * 3 + 2] = c.z + gauss() * 0.12 + a.z * along;
    v.set(gauss(), gauss(), gauss()).normalize().multiplyScalar(5 + Math.random() * 6);
    scatter[i * 3] = v.x; scatter[i * 3 + 1] = v.y; scatter[i * 3 + 2] = v.z;
    const col = PALETTE[k]; color[i * 3] = col.r; color[i * 3 + 1] = col.g; color[i * 3 + 2] = col.b;
    rnd[i] = Math.random();
    const p = paths[Math.floor(Math.random() * paths.length)];
    b1[i * 2] = p[0][0]; b1[i * 2 + 1] = p[0][1]; b2[i * 2] = p[1][0]; b2[i * 2 + 1] = p[1][1];
    jit[i * 3] = gauss(); jit[i * 3 + 1] = gauss(); jit[i * 3 + 2] = gauss();
    flow[i] = Math.random();
  }
  for (let i = 0; i < color.length; i++) { const x = color[i]; color[i] = x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(base, 3));
  geo.setAttribute('aFine', new THREE.BufferAttribute(fine, 3));
  geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  geo.setAttribute('aB1', new THREE.BufferAttribute(b1, 2));
  geo.setAttribute('aB2', new THREE.BufferAttribute(b2, 2));
  geo.setAttribute('aJit', new THREE.BufferAttribute(jit, 3));
  geo.setAttribute('aFlow', new THREE.BufferAttribute(flow, 1));
  // Figure chapters (Figs. 5–11): positions, colours and alpha computed on the CPU each frame
  const chap = createChapters(N);
  const dynPos = new Float32Array(N * 3), dynCol = new Float32Array(N * 3), dynA = new Float32Array(N);
  const aDyn = new THREE.BufferAttribute(dynPos, 3).setUsage(THREE.DynamicDrawUsage);
  const aDynCol = new THREE.BufferAttribute(dynCol, 3).setUsage(THREE.DynamicDrawUsage);
  const aDynA = new THREE.BufferAttribute(dynA, 1).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('aDyn', aDyn); geo.setAttribute('aDynCol', aDynCol); geo.setAttribute('aDynA', aDynA);

  const uniforms = {
    uTime: { value: 0 }, uMix: { value: 0 }, uIntro: { value: F.intro }, uM: { value: new THREE.Matrix3() },
    uTree: { value: 0 }, uHorizon: { value: 0.5 }, uDyn: { value: 0 },
    uSize: { value: small ? 2.6 : 2.4 }, uPR: { value: PR },
    uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: 1 }, uHover: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: /* glsl */`
      uniform float uTime, uMix, uIntro, uSize, uPR, uAspect, uHover, uTree, uHorizon, uDyn;
      uniform mat3 uM; uniform vec2 uMouse;
      attribute vec3 aFine; attribute vec3 aScatter; attribute vec3 aColor; attribute float aRand;
      attribute vec2 aB1; attribute vec2 aB2; attribute vec3 aJit; attribute float aFlow;
      attribute vec3 aDyn; attribute vec3 aDynCol; attribute float aDynA;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float m = clamp(uMix * 1.3 - aRand * 0.3, 0.0, 1.0); m = m * m * (3.0 - 2.0 * m);
        vec3 p = uM * mix(position, aFine, m);
        vec3 ink = vec3(0.114, 0.137, 0.188);
        vec3 col = mix(mix(ink, aColor, 0.16), aColor, m);
        float alpha = 0.5 + 0.42 * aRand;

        // Imagined futures
        float tr = clamp(uTree * 1.35 - aRand * 0.35, 0.0, 1.0); tr = tr * tr * (3.0 - 2.0 * tr);
        float u = fract(aFlow + uTime * 0.028);
        vec3 q = vec3(mix(-2.3, 2.3, u), 0.0, 0.0);
        q.yz = mix(vec2(0.0), aB1, smoothstep(0.03, 0.3, u));
        q.yz = mix(q.yz, aB2, smoothstep(0.34, 0.72, u));
        float over = max(0.0, u - uHorizon) / max(1.0 - uHorizon, 0.06);
        over = clamp(over, 0.0, 1.0);
        q += aJit * (0.022 + 0.022 * u + over * over * 0.62);
        p = mix(p, q, tr);
        vec3 treeCol = mix(vec3(0.169, 0.247, 0.878), vec3(0.6, 0.635, 0.69), over);
        col = mix(col, treeCol, tr);
        float edge = smoothstep(0.0, 0.035, u) * (1.0 - smoothstep(0.95, 1.0, u));
        alpha *= mix(1.0, (1.0 - over * 0.62) * edge * 1.1, tr);

        p += 0.022 * (1.0 - uDyn) * vec3(sin(uTime * 0.55 + aRand * 40.0), cos(uTime * 0.47 + aRand * 31.0), sin(uTime * 0.63 + aRand * 17.0));
        p = mix(p, aDyn, uDyn); col = mix(col, aDynCol, uDyn); alpha = mix(alpha, aDynA, uDyn);
        float it = clamp(uIntro * 1.4 - aRand * 0.4, 0.0, 1.0); it = 1.0 - pow(1.0 - it, 3.0);
        p = mix(aScatter, p, it);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vec2 ndc = gl_Position.xy / gl_Position.w;
        vec2 d = ndc - uMouse; d.x *= uAspect;
        float dist = length(d);
        float f = (1.0 - smoothstep(0.0, 0.22, dist)) * uHover * (1.0 - tr) * (1.0 - uDyn);
        ndc += (d / max(dist, 1e-4)) * f * 0.035 * vec2(1.0 / uAspect, 1.0);
        gl_Position.xy = ndc * gl_Position.w;
        gl_PointSize = uSize * uPR * (7.0 / -mv.z) * (0.7 + aRand * 0.6) * (1.0 + 0.25 * tr) * (1.0 - 0.12 * uDyn);
        vColor = col;
        vAlpha = alpha * it;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vAlpha;
      void main() { vec2 c = gl_PointCoord - 0.5; float r = length(c); if (r > 0.5) discard; gl_FragColor = vec4(vColor, smoothstep(0.5, 0.34, r) * vAlpha); }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  const axisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.9, 0, 0), new THREE.Vector3(1.9, 0, 0), new THREE.Vector3(0, -1.9, 0), new THREE.Vector3(0, 1.9, 0), new THREE.Vector3(0, 0, -1.9), new THREE.Vector3(0, 0, 1.9)]);
  const axisMat = new THREE.LineBasicMaterial({ color: 0x8e97a8, transparent: true, opacity: 0, depthWrite: false });
  const axesObj = new THREE.LineSegments(axisGeo, axisMat);
  const basisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0), new THREE.Vector3(), new THREE.Vector3(0, 1, 0), new THREE.Vector3(), new THREE.Vector3(0, 0, 1)]);
  const basisMat = new THREE.LineBasicMaterial({ color: 0x2b3fe0, transparent: true, opacity: 0, depthWrite: false });
  const basisObj = new THREE.LineSegments(basisGeo, basisMat);
  [axesObj, basisObj].forEach((o) => { o.matrixAutoUpdate = false; o.renderOrder = -1; });

  const group = new THREE.Group();
  group.add(axesObj, basisObj, points);
  scene.add(group);

  let W = 1, H = 1, aspect = 1, wide = true;
  function resize() {
    W = window.innerWidth; H = window.innerHeight; aspect = W / H; wide = W > 960;
    renderer.setSize(W, H, false);
    probe.width = Math.round(W * PR); probe.height = Math.round(H * PR);
    pctx.setTransform(PR, 0, 0, PR, 0, 0);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    uniforms.uAspect.value = aspect;
  }
  window.addEventListener('resize', resize); resize();

  const ptr = { tx: 0, ty: 0, x: 0, y: 0, active: 0 };
  const finePtr = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  window.addEventListener('pointermove', (e) => { ptr.tx = (e.clientX / W) * 2 - 1; ptr.ty = -((e.clientY / H) * 2 - 1); if (finePtr && e.pointerType === 'mouse') ptr.active = 1; }, { passive: true });
  document.addEventListener('pointerleave', () => { ptr.active = 0; });
  window.addEventListener('blur', () => { ptr.active = 0; });

  const M3 = new THREE.Matrix3(), M4 = new THREE.Matrix4(), tmp = new THREE.Vector3();
  const e9 = new Float32Array(9);
  const SAMPLE = []; for (let i = 0; i < N; i += small ? 3 : 4) SAMPLE.push(i);
  const KNN = 9, R = 150;
  const bestD = new Float32Array(KNN), bestX = new Float32Array(KNN), bestY = new Float32Array(KNN);
  const clock = new THREE.Clock();
  let time = 0, hover = 0, rotY = 0.6;
  const TAU = Math.PI * 2;
  let canvasOpacity = -1;

  function project(x, y, z) { tmp.set(x, y, z).applyMatrix4(group.matrixWorld).project(camera); return [(tmp.x + 1) / 2 * W, (1 - tmp.y) / 2 * H]; }

  let probeDirty = false;
  function resetProbe() { if (!probeDirty) return; probe.width = probe.width; pctx.setTransform(PR, 0, 0, PR, 0, 0); probeDirty = false; }
  function drawProbe(opacity, tree) {
    pctx.clearRect(0, 0, W, H);
    if (opacity < 0.05) return;
    // Futures: time axis and the usable horizon
    if (tree > 0.02) {
      probeDirty = true;
      const a = Math.min(1, tree * 1.3) * opacity;
      pctx.font = `500 ${W < 600 ? 10.5 : 12.5}px "Schibsted Grotesk", Arial, sans-serif`;
      pctx.textAlign = 'center'; pctx.textBaseline = 'top';
      for (let k = 0; k <= 8; k++) {
        if (W < 600 && k % 2) continue;
        const [sx, sy] = project(-2.3 + 4.6 * k / 8, -1.55, 0);
        pctx.fillStyle = `rgba(87,96,114,${a})`;
        pctx.fillRect(sx - 0.5, sy - 12, 1, 6);
        pctx.fillText(k ? 't+' + k : 't', sx, sy);
      }
      const hx = -2.3 + 4.6 * F.horizon;
      const [x0, y0] = project(hx, 1.45, 0), [x1, y1] = project(hx, -1.3, 0);
      pctx.strokeStyle = `rgba(43,63,224,${0.85 * a})`; pctx.lineWidth = 1.25; pctx.setLineDash([4, 4]);
      pctx.beginPath(); pctx.moveTo(x0, y0); pctx.lineTo(x1, y1); pctx.stroke(); pctx.setLineDash([]);
      pctx.fillStyle = `rgba(43,63,224,${a})`; pctx.textBaseline = 'bottom';
      pctx.textAlign = x0 > W - 120 ? 'right' : 'center';
      pctx.fillText('Usable horizon', x0 > W - 120 ? x0 + 6 : x0, y0 - 6);
    }
    // Nearest-neighbour probe
    if (!finePtr || hover < 0.03 || F.intro < 0.97 || tree > 0.25) return;
    const mx = (ptr.tx + 1) / 2 * W, my = (1 - ptr.ty) / 2 * H;
    bestD.fill(1e9);
    const mixU = F.mix, mw = group.matrixWorld.elements;
    const P = camera.projectionMatrix.elements, V = camera.matrixWorldInverse.elements;
    for (let s = 0; s < SAMPLE.length; s++) {
      const i = SAMPLE[s], i3 = i * 3;
      let m = smooth(clamp01(mixU * 1.3 - rnd[i] * 0.3));
      const bx = base[i3] + (fine[i3] - base[i3]) * m, by = base[i3 + 1] + (fine[i3 + 1] - base[i3 + 1]) * m, bz = base[i3 + 2] + (fine[i3 + 2] - base[i3 + 2]) * m;
      // uM (column-major e9)
      const px = e9[0] * bx + e9[3] * by + e9[6] * bz, py = e9[1] * bx + e9[4] * by + e9[7] * bz, pz = e9[2] * bx + e9[5] * by + e9[8] * bz;
      tmp.set(px, py, pz).applyMatrix4(group.matrixWorld).project(camera);
      let nx = tmp.x, ny = tmp.y;
      let dx = (nx - ptr.tx) * aspect, dy = ny - ptr.ty;
      const dist = Math.hypot(dx, dy);
      const f = (1 - Math.min(1, Math.max(0, dist / 0.22)) ** 2 * (3 - 2 * Math.min(1, dist / 0.22))) * hover;
      if (dist > 1e-4 && f > 0) { nx += (dx / dist) * f * 0.035 / aspect; ny += (dy / dist) * f * 0.035; }
      const sx = (nx + 1) / 2 * W, sy = (1 - ny) / 2 * H;
      const ddx = sx - mx, ddy = sy - my, d2 = ddx * ddx + ddy * ddy;
      if (d2 > R * R || d2 >= bestD[KNN - 1]) continue;
      let j = KNN - 1;
      while (j > 0 && bestD[j - 1] > d2) { bestD[j] = bestD[j - 1]; bestX[j] = bestX[j - 1]; bestY[j] = bestY[j - 1]; j--; }
      bestD[j] = d2; bestX[j] = sx; bestY[j] = sy;
    }
    let n = 0; while (n < KNN && bestD[n] < 1e9) n++;
    if (!n) return;
    probeDirty = true;
    const a = hover * opacity;
    pctx.lineWidth = 1;
    for (let k = n - 1; k >= 0; k--) {
      const al = (0.25 + 0.6 * (1 - k / KNN)) * a;
      pctx.strokeStyle = `rgba(43,63,224,${al})`;
      pctx.beginPath(); pctx.moveTo(mx, my); pctx.lineTo(bestX[k], bestY[k]); pctx.stroke();
      pctx.beginPath(); pctx.arc(bestX[k], bestY[k], k === 0 ? 5 : 3.5, 0, TAU); pctx.stroke();
    }
    pctx.fillStyle = `rgba(43,63,224,${a})`;
    pctx.beginPath(); pctx.arc(mx, my, 2.5, 0, TAU); pctx.fill();
    pctx.font = '500 12px "Schibsted Grotesk", Arial, sans-serif'; pctx.textAlign = 'left'; pctx.textBaseline = 'middle';
    pctx.fillText(`${n} nearest neighbours`, mx + 14, my - 14);
  }

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const fadeBack = F.fadeIn;
    const halfH0 = Math.tan(THREE.MathUtils.degToRad(17)) * camera.position.z;
    const chapVis = chap.count ? chap.update(W, H, halfH0 * aspect, halfH0, time, dynPos, dynCol, dynA) : 0;
    const dyn = chapVis > 0.001;
    const opacity = Math.max(chapVis, clamp01(1 - F.fadeOut + fadeBack * (wide ? 0.95 : 0.4)));
    if (Math.abs(opacity - canvasOpacity) > 0.002) { canvasOpacity = opacity; canvas.style.opacity = opacity.toFixed(3); probe.style.opacity = opacity.toFixed(3); probe.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'; }
    if (opacity < 0.005) { resetProbe(); return; }
    const treeNow = dyn ? 1 : F.tree * (1 - F.fadeIn);
    if (!F.reduce) { time += dt; if (treeNow < 0.001) rotY += dt * 0.045; }
    ptr.x = lerp(ptr.x, ptr.tx, 0.06); ptr.y = lerp(ptr.y, ptr.ty, 0.06);
    hover = lerp(hover, ptr.active, 0.08);

    const t = F.t, T = F.T;
    for (let k = 0; k < 9; k++) { const id = k % 4 === 0 ? 1 : 0; e9[k] = id + (T[k] - id) * t; }
    // e9 is row-major from T; convert to column-major for the CPU probe
    const r = [...e9];
    e9[0] = r[0]; e9[1] = r[3]; e9[2] = r[6]; e9[3] = r[1]; e9[4] = r[4]; e9[5] = r[7]; e9[6] = r[2]; e9[7] = r[5]; e9[8] = r[8];
    M3.set(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]);
    uniforms.uM.value.copy(M3);
    M4.set(r[0], r[1], r[2], 0, r[3], r[4], r[5], 0, r[6], r[7], r[8], 0, 0, 0, 0, 1);
    axesObj.matrix.copy(M4); basisObj.matrix.copy(M4);

    const tree = F.tree * (1 - fadeBack);
    uniforms.uTime.value = time;
    uniforms.uMix.value = F.mix;
    uniforms.uIntro.value = F.intro;
    uniforms.uHover.value = hover;
    uniforms.uTree.value = tree;
    uniforms.uHorizon.value = F.horizon;
    uniforms.uMouse.value.set(ptr.tx, ptr.ty);
    uniforms.uDyn.value = dyn ? 1 : 0;
    if (dyn) { aDyn.needsUpdate = true; aDynCol.needsUpdate = true; aDynA.needsUpdate = true; }

    const s = F.shift;
    const halfW = Math.tan(THREE.MathUtils.degToRad(17)) * camera.position.z * aspect;
    let sc, px, py;
    if (wide) {
      sc = lerp(1.08, 1.04, s) * (1 - 0.14 * fadeBack);
      px = halfW * 0.4 + halfW * 0.16 * fadeBack;
      py = lerp(0.12, 0, s);
      sc = lerp(sc, 0.9, tree); px = lerp(px, halfW * 0.42, tree); py = lerp(py, 0.1, tree);
    } else {
      sc = Math.max(0.55, Math.min(1, aspect * 1.25)) * (1 - 0.14 * fadeBack);
      px = 0;
      py = lerp(1.34, 0.7, s) + 0.35 * fadeBack;
      sc = lerp(sc, (halfW * 0.94) / 2.4, tree); py = lerp(py, 0.85, tree);
    }
    group.scale.setScalar(sc);
    group.position.set(px, py, 0);
    const straight = Math.round(rotY / TAU) * TAU;
    group.rotation.y = lerp(rotY + ptr.x * 0.28, straight + ptr.x * 0.06, tree);
    group.rotation.x = lerp(0.32 - ptr.y * 0.16, 0.06 - ptr.y * 0.04, tree);
    if (dyn) { group.position.set(0, 0, 0); group.rotation.set(0, 0, 0); group.scale.setScalar(1); }
    group.updateMatrixWorld();

    const reveal = dyn ? 0 : Math.max(0, (F.intro - 0.55) / 0.45) * (1 - tree);
    axisMat.opacity = 0.28 * reveal;
    basisMat.opacity = (0.35 + 0.5 * t) * reveal;

    renderer.render(scene, camera);
    if (dyn) resetProbe(); else drawProbe(opacity, tree);
  }
  frame();
}
init();
