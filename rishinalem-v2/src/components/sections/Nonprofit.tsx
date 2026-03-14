"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";

function NeuralNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = useMemo(() => {
    const result = [];
    for (let i = 0; i < 40; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      });
    }
    return result;
  }, []);

  const connections = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          result.push({ from: i, to: j, delay: Math.random() * 2 });
        }
      }
    }
    return result;
  }, [nodes]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate connection paths
      const paths = svgRef.current?.querySelectorAll(".neural-path");
      paths?.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength?.() || 100;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: connections[i]?.delay || 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 70%",
          },
        });
      });

      // Pulse nodes
      const circles = svgRef.current?.querySelectorAll(".neural-node");
      circles?.forEach((circle) => {
        gsap.to(circle, {
          scale: 1.5,
          opacity: 0.8,
          duration: 1,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 3,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, [connections]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {connections.map((conn, i) => (
        <line
          key={i}
          className="neural-path"
          x1={nodes[conn.from].x}
          y1={nodes[conn.from].y}
          x2={nodes[conn.to].x}
          y2={nodes[conn.to].y}
          stroke="var(--plasma)"
          strokeWidth="0.15"
          opacity="0.2"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          className="neural-node"
          cx={node.x}
          cy={node.y}
          r="0.4"
          fill="var(--plasma)"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

export default function Nonprofit() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useMagnetic<HTMLAnchorElement>(0.3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nonprofit-headline span", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      gsap.from(".nonprofit-stat", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".nonprofit-stat",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="nonprofit"
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      <NeuralNetwork />

      <div className="container-wide relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase mb-6 block"
            style={{
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Social Impact
          </span>

          <h2 className="nonprofit-headline text-4xl md:text-6xl lg:text-8xl font-bold italic mb-8 leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            <div className="overflow-hidden">
              <span className="block" style={{ color: "var(--text-bright)" }}>
                Making Education
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block" style={{ color: "var(--text-bright)" }}>
                Accessible to
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block" style={{ color: "var(--plasma)" }}>
                Everyone.
              </span>
            </div>
          </h2>

          <p
            className="text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
            style={{ color: "var(--text-mid)" }}
          >
            Nalem Study Circle is a nonprofit dedicated to providing AI-powered
            personalized learning tools for students and lifelong learners. Our
            mission: quality education for everyone, regardless of background.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: "2,400+", label: "Students Served" },
              { value: "12", label: "Countries" },
              { value: "500+", label: "Resources" },
              { value: "Free", label: "Always" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="nonprofit-stat p-4 rounded-xl"
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
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              ref={btnRef}
              href="https://nalemstudycircle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[var(--plasma-dim)]"
              style={{
                background: "var(--plasma)",
                color: "var(--ink)",
              }}
            >
              Visit Nalem Study Circle
            </a>
            <a
              href="https://blog.nalemstudycircle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-colors duration-300"
              style={{
                border: "1px solid var(--border-faint)",
                color: "var(--text-mid)",
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
