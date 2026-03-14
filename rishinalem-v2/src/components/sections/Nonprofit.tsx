"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "@/lib/gsap";

function NeuralNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, connections } = useMemo(() => {
    const n = [];
    for (let i = 0; i < 40; i++) {
      n.push({ x: Math.random() * 100, y: Math.random() * 100 });
    }
    const c = [];
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].x - n[j].x;
        const dy = n[i].y - n[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          c.push({ from: i, to: j, delay: Math.random() * 2 });
        }
      }
    }
    return { nodes: n, connections: c };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll(".neural-path");
      paths?.forEach((path, i) => {
        const length = (path as SVGLineElement).getTotalLength?.() || 100;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: connections[i]?.delay || 0,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svgRef.current, start: "top 70%" },
        });
      });
    });
    return () => ctx.revert();
  }, [connections]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {connections.map((conn, i) => (
        <line key={i} className="neural-path"
          x1={nodes[conn.from].x} y1={nodes[conn.from].y}
          x2={nodes[conn.to].x} y2={nodes[conn.to].y}
          stroke="var(--plasma)" strokeWidth="0.15" opacity="0.15"
        />
      ))}
      {nodes.map((node, i) => (
        <circle key={i} cx={node.x} cy={node.y} r="0.4" fill="var(--plasma)" opacity="0.25" />
      ))}
    </svg>
  );
}

export default function Nonprofit() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nonprofit-headline-line", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
      });

      gsap.from(".nonprofit-stat", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".nonprofit-stat", start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="nonprofit"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      <NeuralNetwork />

      <div className="container-wide relative z-10">
        <div className="flex flex-col items-center text-center">
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase mb-8 block"
            style={{
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Social Impact
          </span>

          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic mb-10 leading-[1.15]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            <div className="overflow-hidden">
              <span className="nonprofit-headline-line block" style={{ color: "var(--text-bright)" }}>
                Making Education
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="nonprofit-headline-line block" style={{ color: "var(--text-bright)" }}>
                Accessible to
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="nonprofit-headline-line block" style={{ color: "var(--plasma)" }}>
                Everyone.
              </span>
            </div>
          </h2>

          <p
            className="text-base md:text-lg leading-relaxed mb-14 max-w-2xl"
            style={{ color: "var(--text-mid)" }}
          >
            Nalem Study Circle is a nonprofit dedicated to providing AI-powered
            personalized learning tools for students and lifelong learners. Our
            mission: quality education for everyone, regardless of background.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14 w-full max-w-3xl">
            {[
              { value: "2,400+", label: "Students Served" },
              { value: "12", label: "Countries" },
              { value: "500+", label: "Resources" },
              { value: "Free", label: "Always" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="nonprofit-stat p-5 rounded-xl text-center"
                style={{
                  background: "var(--shadow)",
                  border: "1px solid var(--border-faint)",
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--plasma)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://nalemstudycircle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(0,255,148,0.15)]"
              style={{
                background: "var(--plasma)",
                color: "var(--ink)",
                padding: "14px 32px",
              }}
            >
              Visit Nalem Study Circle
            </a>
            <a
              href="https://blog.nalemstudycircle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-300 hover:border-[var(--border-glow)]"
              style={{
                border: "1px solid var(--border-faint)",
                color: "var(--text-mid)",
                padding: "14px 32px",
              }}
            >
              Read Our Blog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
