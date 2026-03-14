"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const EVENTS = [
  { year: 2018, title: "Started Programming", desc: "Began my journey learning Python, discovering the world of code." },
  { year: 2019, title: "First Robotics Build", desc: "Built my first robot with Arduino, sparking a lifelong passion for hardware." },
  { year: 2020, title: "VEX IQ Competitions", desc: "Competed in robotics tournaments, honing design and strategy skills." },
  { year: 2021, title: "Mobile App Development", desc: "Created my first Flutter mobile app, entering the world of cross-platform development." },
  { year: 2022, title: "Alan AI Internship", desc: "Joined Alan AI, building voice-enabled applications and pioneering AI integration." },
  { year: 2023, title: "AI Robot Arm + Nonprofit", desc: "Built an AI-powered robot arm and founded Nalem Study Circle nonprofit." },
  { year: 2024, title: "Advanced Systems", desc: "Developed complex Raspberry Pi systems and advanced autonomous robotics." },
  { year: 2025, title: "The Future...", desc: "Continuing to push the boundaries of AI, robotics, and innovation." },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Year counter tied to scroll
      gsap.to(yearRef.current, {
        innerText: 2025,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Card entrance animations
      const cards = document.querySelectorAll(".timeline-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          x: 60,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // SVG line draw
      const line = document.querySelector(".timeline-line");
      if (line) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-32"
      style={{ background: "var(--ink)" }}
    >
      <div className="container-wide">
        <div className="text-center mb-20">
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
            style={{
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            The Journey
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            My Timeline
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div
            className="timeline-line absolute left-0 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "var(--plasma)", opacity: 0.3 }}
          />

          {/* Sticky year (desktop) */}
          <div className="hidden md:block sticky top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <span
              ref={yearRef}
              className="absolute left-1/2 -translate-x-1/2 text-8xl font-bold opacity-10"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "var(--plasma)",
              }}
            >
              2018
            </span>
          </div>

          {/* Event cards */}
          <div className="relative z-10 space-y-16 pl-8 md:pl-0">
            {EVENTS.map((event, i) => (
              <div
                key={event.year}
                className={`timeline-card relative flex ${
                  i % 2 === 0
                    ? "md:justify-start md:pr-[52%]"
                    : "md:justify-end md:pl-[52%]"
                }`}
              >
                {/* Dot on the line */}
                <div
                  className="absolute left-0 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full z-10"
                  style={{
                    background: "var(--plasma)",
                    boxShadow: "0 0 12px var(--plasma-dim)",
                  }}
                />

                {/* Card */}
                <div
                  className="w-full p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--shadow)",
                    border: "1px solid var(--border-faint)",
                    borderLeft: "3px solid var(--plasma)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = "var(--plasma)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,255,148,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="text-sm font-semibold mb-1 block"
                    style={{
                      color: "var(--plasma)",
                      fontFamily: "var(--font-jetbrains), monospace",
                    }}
                  >
                    {event.year}
                  </span>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "var(--text-bright)",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
