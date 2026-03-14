"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
  { year: 2018, title: "Started Programming", desc: "Began my journey learning Python, discovering the world of code and building my first programs." },
  { year: 2019, title: "First Robotics Build", desc: "Built my first robot with Arduino, sparking a lifelong passion for hardware and engineering." },
  { year: 2020, title: "VEX IQ Competitions", desc: "Competed in robotics tournaments, honing design thinking and strategic problem-solving skills." },
  { year: 2021, title: "Mobile App Development", desc: "Created my first Flutter mobile app, entering the world of cross-platform development." },
  { year: 2022, title: "Alan AI Internship", desc: "Joined Alan AI, building voice-enabled applications and pioneering AI integration in software." },
  { year: 2023, title: "AI Robot Arm + Nonprofit", desc: "Built an AI-powered robot arm with computer vision and founded Nalem Study Circle nonprofit." },
  { year: 2024, title: "Advanced Systems", desc: "Developed complex Raspberry Pi systems and advanced autonomous robotics projects." },
  { year: 2025, title: "The Future...", desc: "Continuing to push the boundaries of AI, robotics, and innovation." },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".timeline-card");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const line = document.querySelector(".timeline-line-inner");
      if (line) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
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
        <div className="text-center mb-20 md:mb-28">
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

        {/* Timeline container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line track (background) */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: "24px",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          {/* Animated fill line */}
          <div
            className="timeline-line-inner absolute top-0 bottom-0 w-px"
            style={{
              left: "24px",
              background: "var(--plasma)",
              opacity: 0.4,
            }}
          />

          {/* Event cards */}
          <div className="relative z-10 flex flex-col gap-10 md:gap-14">
            {EVENTS.map((event) => (
              <div key={event.year} className="timeline-card relative flex items-start gap-6 md:gap-10">
                {/* Dot + year column */}
                <div className="flex flex-col items-center shrink-0" style={{ width: "48px" }}>
                  <div
                    className="w-3 h-3 rounded-full mt-1.5"
                    style={{
                      background: "var(--plasma)",
                      boxShadow: "0 0 12px var(--plasma-dim)",
                    }}
                  />
                  <span
                    className="mt-2 text-xs font-bold"
                    style={{
                      color: "var(--plasma)",
                      fontFamily: "var(--font-jetbrains), monospace",
                    }}
                  >
                    {event.year}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="flex-1 p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--shadow)",
                    border: "1px solid var(--border-faint)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,148,0.06)";
                    e.currentTarget.style.borderColor = "var(--border-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border-faint)";
                  }}
                >
                  <h3
                    className="text-lg md:text-xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "var(--text-bright)",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "var(--text-mid)" }}
                  >
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
