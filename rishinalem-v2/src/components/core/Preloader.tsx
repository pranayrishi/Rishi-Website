"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const tl = gsap.timeline({
      onComplete: () => {
        const lenis = getLenis();
        if (lenis) {
          lenis.start();
        }
        document.body.style.overflow = "auto";
        setDone(true);
      },
    });

    // Scan line
    tl.to(
      scanRef.current,
      { top: "100%", duration: 0.5, ease: "none" },
      0.3
    );

    // Initials reveal
    tl.to(
      initialsRef.current,
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.6,
        ease: "expo.out",
      },
      0.8
    );

    // Counter scramble
    tl.to(
      {},
      {
        duration: 0.8,
        onUpdate: function (this: gsap.core.Tween) {
          const progress = Math.round(this.progress() * 100);
          const str = progress.toString().padStart(3, "0");
          if (counterRef.current) {
            let scrambled = "";
            for (let i = 0; i < str.length; i++) {
              if (Math.random() > 0.5 || progress > 90) {
                scrambled += str[i];
              } else {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
              }
            }
            counterRef.current.textContent = scrambled;
          }
        },
      },
      1.0
    );

    // Wipe away
    tl.to(
      containerRef.current,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "expo.inOut",
      },
      2.0
    );

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{
        background: "var(--ink)",
        clipPath: "inset(0 0 0% 0)",
      }}
    >
      {/* Scan line */}
      <div
        ref={scanRef}
        className="absolute left-0 w-full"
        style={{
          top: "0%",
          height: "1px",
          background: "var(--plasma)",
          boxShadow: "0 0 20px var(--plasma), 0 0 60px var(--plasma)",
        }}
      />

      {/* Initials */}
      <div
        ref={initialsRef}
        className="font-[var(--font-playfair)] text-7xl md:text-9xl font-bold italic tracking-tight"
        style={{
          color: "var(--text-bright)",
          clipPath: "inset(0 100% 0 0)",
          fontFamily: "var(--font-playfair), Georgia, serif",
        }}
      >
        R.N.
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        className="mt-6 text-sm tracking-[0.3em]"
        style={{
          color: "var(--plasma)",
          fontFamily: "var(--font-jetbrains), monospace",
        }}
      >
        000
      </span>
    </div>
  );
}
