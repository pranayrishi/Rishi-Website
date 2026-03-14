"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";

const STATS = [
  { value: "6+", label: "Languages" },
  { value: "4+", label: "Yrs Robotics" },
  { value: "30+", label: "Projects" },
  { value: "1", label: "Nonprofit" },
];

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const wrapper = wrapperRef.current;
      const panels = track?.querySelectorAll(".about-panel");
      if (!track || !wrapper || !panels || panels.length === 0) return;

      const totalScroll = (panels.length - 1) * window.innerWidth;

      gsap.to(track, {
        x: () => -(totalScroll),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          end: () => "+=" + totalScroll,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about">
      <div ref={wrapperRef} style={{ overflow: "hidden" }}>
        <div
          ref={trackRef}
          className="flex"
          style={{ width: "300vw" }}
        >
          {/* Panel 1: Who I Am */}
          <div
            className="about-panel flex-shrink-0 flex items-center justify-center px-8 md:px-16"
            style={{
              width: "100vw",
              height: "100vh",
              background: "var(--ink)",
            }}
          >
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <span
                  className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
                  style={{
                    color: "var(--plasma)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  01 / About
                </span>
                <h2
                  className="text-4xl md:text-6xl font-bold italic mb-6"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--text-bright)",
                  }}
                >
                  Who I Am
                </h2>
                <p
                  className="text-base md:text-lg leading-relaxed mb-4"
                  style={{ color: "var(--text-mid)" }}
                >
                  I have a deep passion for robotics and programming, constantly
                  pushing boundaries in AI, software, and hardware. I&apos;m always
                  open to new opportunities that broaden my skill set.
                </p>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: "var(--text-mid)" }}
                >
                  With experience in 6+ programming languages and 4+ years of
                  hands-on robotics, I&apos;ve built everything from AI-powered apps
                  to autonomous systems — always focused on meaningful impact.
                </p>
              </div>

              <div className="relative flex justify-center">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    width: 320,
                    height: 400,
                    transform: "rotate(3deg)",
                    border: "1px solid var(--border-faint)",
                  }}
                >
                  <Image
                    src="/images/rishi.jpg"
                    alt="Rishi Nalem"
                    fill
                    className="object-cover"
                    sizes="340px"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--ink) 0%, transparent 40%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: What I Do */}
          <div
            className="about-panel flex-shrink-0 flex items-center justify-center px-8 md:px-16"
            style={{
              width: "100vw",
              height: "100vh",
              background: "var(--void)",
            }}
          >
            <div className="max-w-5xl w-full text-center">
              <span
                className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
                style={{
                  color: "var(--plasma)",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                02 / Expertise
              </span>
              <h2
                className="text-4xl md:text-6xl font-bold italic mb-12"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                What I Do
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: "AI & ML", desc: "Voice assistants, computer vision, NLP" },
                  { title: "Robotics", desc: "Arduino, Raspberry Pi, VEX IQ, Sensors" },
                  { title: "App Dev", desc: "Flutter, React, Full-stack development" },
                  { title: "Software", desc: "Python, C++, JS, Java, Dart" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: "var(--shadow)",
                      border: "1px solid var(--border-faint)",
                    }}
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "var(--plasma)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-mid)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 3: By The Numbers */}
          <div
            className="about-panel flex-shrink-0 flex items-center justify-center px-8 md:px-16"
            style={{
              width: "100vw",
              height: "100vh",
              background: "var(--ink)",
            }}
          >
            <div className="max-w-4xl w-full text-center">
              <span
                className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
                style={{
                  color: "var(--plasma)",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                03 / Impact
              </span>
              <h2
                className="text-4xl md:text-6xl font-bold italic mb-16"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                By The Numbers
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span
                      className="about-stat-value text-5xl md:text-6xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        color: "var(--plasma)",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-sm tracking-wider uppercase"
                      style={{
                        color: "var(--text-mid)",
                        fontFamily: "var(--font-jetbrains), monospace",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
