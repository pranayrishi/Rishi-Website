"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ORBITS = [
  {
    skills: [
      { name: "Python", icon: "🐍" },
      { name: "JavaScript", icon: "⚡" },
      { name: "C++", icon: "⚙️" },
      { name: "Dart", icon: "🎯" },
      { name: "Java", icon: "☕" },
    ],
    radius: 120,
    speed: 20,
    color: "var(--plasma)",
  },
  {
    skills: [
      { name: "Arduino", icon: "🔌" },
      { name: "Raspberry Pi", icon: "🍓" },
      { name: "VEX IQ", icon: "🤖" },
      { name: "Microbit", icon: "📡" },
    ],
    radius: 190,
    speed: 30,
    color: "var(--amber)",
  },
  {
    skills: [
      { name: "Flutter", icon: "📱" },
      { name: "React", icon: "⚛️" },
      { name: "Three.js", icon: "🌐" },
      { name: "Alan AI", icon: "🗣️" },
      { name: "TensorFlow", icon: "🧠" },
    ],
    radius: 260,
    speed: 40,
    color: "var(--plasma)",
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setTime((t) => t + 0.005);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skills-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
            style={{
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Technical Arsenal
          </span>
          <h2
            className="skills-title text-4xl md:text-6xl lg:text-7xl font-bold italic"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Skills & Technologies
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Orbital system — desktop only */}
          <div
            className="relative hidden lg:block mx-auto"
            style={{ width: 560, height: 560 }}
          >
            {/* Center glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{
                background: "var(--plasma)",
                boxShadow: "0 0 40px var(--plasma), 0 0 80px var(--plasma-dim)",
              }}
            />

            {/* Orbit rings */}
            {ORBITS.map((orbit, oi) => (
              <div key={oi}>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: orbit.radius * 2,
                    height: orbit.radius * 2,
                    border: `1px solid ${orbit.color}`,
                    opacity: 0.15,
                  }}
                />

                {orbit.skills.map((skill, si) => {
                  const angle =
                    (si / orbit.skills.length) * Math.PI * 2 +
                    time * (10 / orbit.speed);
                  const x = Math.cos(angle) * orbit.radius;
                  const y = Math.sin(angle) * orbit.radius;

                  return (
                    <button
                      key={skill.name}
                      className="absolute top-1/2 left-1/2 flex items-center justify-center z-10"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) ${
                          activeSkill === skill.name ? "scale(1.3)" : "scale(1)"
                        }`,
                        transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s, background 0.3s",
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background:
                          activeSkill === skill.name
                            ? "var(--shadow)"
                            : "var(--mist)",
                        border: `1px solid ${
                          activeSkill === skill.name
                            ? "var(--plasma)"
                            : "var(--border-faint)"
                        }`,
                        boxShadow:
                          activeSkill === skill.name
                            ? "0 0 20px var(--plasma-dim)"
                            : "none",
                      }}
                      onMouseEnter={() => setActiveSkill(skill.name)}
                      onMouseLeave={() => setActiveSkill(null)}
                    >
                      <span className="text-xl">{skill.icon}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right side: detail panel (desktop) + full grid (mobile) */}
          <div className="w-full lg:w-auto lg:min-w-[320px]">
            {/* Skill detail — desktop */}
            <div
              className="hidden lg:block p-8 rounded-2xl transition-all duration-500 mb-6"
              style={{
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
                opacity: activeSkill ? 1 : 0.5,
              }}
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: activeSkill ? "var(--plasma)" : "var(--text-dim)",
                }}
              >
                {activeSkill || "Hover a skill"}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-mid)" }}>
                {activeSkill
                  ? `Proficient in ${activeSkill} — used across multiple projects in AI, robotics, and application development.`
                  : "Hover over any node in the orbital system to see details about each technology."}
              </p>
            </div>

            {/* Grid — visible on all sizes, acts as main display on mobile */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
              {ORBITS.flatMap((o) => o.skills).map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--mist)",
                    border: "1px solid var(--border-faint)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-glow)";
                    e.currentTarget.style.boxShadow = "0 4px 20px var(--plasma-dim)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-faint)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span className="text-2xl">{skill.icon}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-mid)" }}
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
