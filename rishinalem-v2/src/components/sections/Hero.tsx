"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import dynamic from "next/dynamic";
import { getLenis } from "@/lib/scroll";

const HeroBackground = dynamic(
  () => import("@/components/webgl/HeroBackground"),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[var(--ink)]" /> }
);

const MARQUEE_TEXT =
  "CREATIVE DEVELOPER · ROBOTICS ENGINEER · AI INNOVATOR · ";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const btnRef = useMagnetic<HTMLAnchorElement>(0.3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.5 });

      // Line reveals
      [line1Ref, line2Ref, line3Ref].forEach((ref, i) => {
        if (ref.current) {
          tl.from(
            ref.current,
            {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
            },
            2.5 + i * 0.12
          );
        }
      });

      // Description
      if (descRef.current) {
        tl.from(
          descRef.current,
          { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        );
      }

      // CTA
      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (target) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      {/* Marquee strip */}
      <div className="absolute top-[18%] w-full overflow-hidden z-10 opacity-30">
        <div
          className="flex whitespace-nowrap animate-marquee"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "var(--text-dim)",
          }}
        >
          <span className="px-2">{MARQUEE_TEXT.repeat(8)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Headline */}
        <h1 className="mb-6">
          <div className="overflow-hidden">
            <span
              ref={line1Ref}
              className="block text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-bold italic leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "var(--text-bright)",
              }}
            >
              Building Worlds
            </span>
          </div>
          <div className="overflow-hidden">
            <span
              ref={line2Ref}
              className="block text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-bold italic leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "var(--text-bright)",
              }}
            >
              Between Code
            </span>
          </div>
          <div className="overflow-hidden">
            <span
              ref={line3Ref}
              className="block text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-bold italic leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "var(--plasma)",
              }}
            >
              + Robotics.
            </span>
          </div>
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-10"
          style={{ color: "var(--text-mid)" }}
        >
          I transform abstract ideas into intelligent systems — from AI agents
          and robotics to mobile apps and interactive experiences.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center">
          <a
            ref={btnRef}
            href="#projects"
            onClick={handleExploreClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[var(--plasma-dim)]"
            style={{
              background: "var(--plasma)",
              color: "var(--ink)",
            }}
          >
            Explore Projects
            <span className="text-lg">&rarr;</span>
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#about");
              if (target) {
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-colors duration-300 hover:text-[var(--plasma)]"
            style={{ color: "var(--text-mid)" }}
          >
            Learn More
            <span className="animate-bounce inline-block">&darr;</span>
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ color: "var(--text-dim)" }}
      >
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "var(--text-dim)" }}
        >
          <div
            className="w-1 h-2 rounded-full animate-bounce"
            style={{ background: "var(--plasma)" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
