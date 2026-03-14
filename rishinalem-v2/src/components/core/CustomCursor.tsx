"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let currentX = 0;
    let currentY = 0;

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    function animate() {
      currentX += (posRef.current.x - currentX) * 0.1;
      currentY += (posRef.current.y - currentY) * 0.1;
      gsap.set(ring, { x: currentX, y: currentY });
      requestAnimationFrame(animate);
    }

    const handleEnterInteractive = () => {
      gsap.to(ring, {
        width: 72,
        height: 72,
        background: "rgba(0,255,148,0.08)",
        borderColor: "transparent",
        duration: 0.3,
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    };

    const handleLeaveInteractive = () => {
      gsap.to(ring, {
        width: 40,
        height: 40,
        background: "transparent",
        borderColor: "var(--plasma)",
        duration: 0.3,
      });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    };

    const handleDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
    };

    const handleUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "elastic.out(1,0.5)" });
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    const interactives = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleEnterInteractive);
      el.addEventListener("mouseleave", handleLeaveInteractive);
    });

    const rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnterInteractive);
        el.removeEventListener("mouseleave", handleLeaveInteractive);
      });
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10001] pointer-events-none hidden lg:block"
        style={{
          width: 8,
          height: 8,
          background: "var(--plasma)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10001] pointer-events-none hidden lg:block"
        style={{
          width: 40,
          height: 40,
          border: "1px solid var(--plasma)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.6,
        }}
      />
    </>
  );
}
