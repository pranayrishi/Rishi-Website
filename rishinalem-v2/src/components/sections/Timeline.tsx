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
      // Card entrance animations
      const cards = document.querySelectorAll(".timeline-card");
      cards.forEach((card) => {
        gsap.from(card, {
          x: 60,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Line draw
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
      className="section-padding relative"
      style={{ background: "var(--ink)" }}
    >
      <div className="container-wide">
        {/* Section header */}
        <div className="text-center mb-24">
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
            className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{ background: "var(--plasma)", opacity: 0.3 }}
          />

          {/* Event cards */}
          <div className="relative z-10 space-y-12 md:space-y-20">
            {EVENTS.map((event, i) => (
              <div
                key={event.year}
                className={`timeline-card relative pl-12 md:pl-0 ${
                  i % 2 === 0
                    ? "md:pr-[54%] md:text-right"
                    : "md:pl-[54%] md:text-left"
                }`}
              >
                {/* Dot on the line */}
                <div
                  className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full z-10"
                  style={{
                    background: "var(--plasma)",
                    boxShadow: "0 0 12px var(--plasma-dim)",
                  }}
                />

                {/* Connector line from dot to card */}
                <div
                  className="hidden md:block absolute top-7 h-px"
                  style={{
                    background: "var(--plasma)",
                    opacity: 0.15,
                    ...(i % 2 === 0
                      ? { right: "54%", left: "50%", marginLeft: "6px" }
                      : { left: "50%", right: "auto", width: "3%", marginLeft: "6px" }),
                  }}
                />

                {/* Card */}
                <div
                  className="p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--shadow)",
                    border: "1px solid var(--border-faint)",
                    borderLeft: "3px solid var(--plasma)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,255,148,0.08)";
                    e.currentTarget.style.borderColor = "var(--border-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border-faint)";
                  }}
                >
                  <span
                    className="text-sm font-bold mb-2 block"
                    style={{
                      color: "var(--plasma)",
                      fontFamily: "var(--font-jetbrains), monospace",
                    }}
                  >
                    {event.year}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "var(--text-bright)",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-mid)" }}>
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
