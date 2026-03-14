"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenisInstance: Lenis | null = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.8,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenisInstance?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
