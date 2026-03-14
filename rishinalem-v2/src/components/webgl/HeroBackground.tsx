"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uVelocity;
varying vec2 vUv;
varying float vElevation;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vUv=uv;
  vec3 pos=position;
  float noise=snoise(vec3(pos.x*0.8,pos.y*0.8,uTime*0.2));
  float elevation=noise*0.3;
  float mouseDist=distance(uv,uMouse);
  float mouseInfluence=smoothstep(0.4,0.0,mouseDist)*0.15;
  elevation+=mouseInfluence;
  pos.z+=elevation;
  vElevation=elevation;
  float PI=3.14159265;
  float stretch=sin(pos.y*PI+PI/2.0)*abs(uVelocity*0.005);
  pos.y*=1.0+stretch;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main(){
  vec3 baseColor=vec3(0.027,0.027,0.035);
  vec3 plasmaColor=vec3(0.0,1.0,0.58);
  float plasmaStrength=smoothstep(0.0,0.3,vElevation)*0.12;
  float bottomGlow=smoothstep(1.0,0.3,vUv.y)*0.05;
  vec3 finalColor=mix(baseColor,plasmaColor,plasmaStrength+bottomGlow);
  float vignette=1.0-smoothstep(0.3,0.8,distance(vUv,vec2(0.5)));
  finalColor*=0.8+vignette*0.2;
  gl_FragColor=vec4(finalColor,1.0);
}
`;

function NoisePlane() {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseCurrent = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime;

    mouseTarget.current.set(
      (pointer.x + 1) / 2,
      (pointer.y + 1) / 2
    );
    mouseCurrent.current.lerp(mouseTarget.current, 0.05);
    uniforms.uMouse.value.copy(mouseCurrent.current);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry
        args={[viewport.width * 1.5, viewport.height * 1.5, 96, 96]}
      />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const p = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const y = p.getY(i);
      p.setY(
        i,
        y + Math.sin(clock.elapsedTime * 0.3 + i * 0.1) * 0.002
      );
    }
    p.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00ff94"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <NoisePlane />
        <Particles />
      </Canvas>
    </div>
  );
}
