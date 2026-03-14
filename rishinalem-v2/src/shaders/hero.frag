uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Base color: near-black
  vec3 baseColor = vec3(0.027, 0.027, 0.035);

  // Plasma green wisps based on elevation
  vec3 plasmaColor = vec3(0.0, 1.0, 0.58);

  float plasmaStrength = smoothstep(0.0, 0.3, vElevation) * 0.12;

  // Add subtle gradient from bottom
  float bottomGlow = smoothstep(1.0, 0.3, vUv.y) * 0.05;

  vec3 finalColor = mix(baseColor, plasmaColor, plasmaStrength + bottomGlow);

  // Subtle vignette
  float vignette = 1.0 - smoothstep(0.3, 0.8, distance(vUv, vec2(0.5)));
  finalColor *= 0.8 + vignette * 0.2;

  gl_FragColor = vec4(finalColor, 1.0);
}
