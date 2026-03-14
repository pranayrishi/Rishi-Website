"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Github, Linkedin, Youtube, BookOpen, Copy, Check } from "lucide-react";

const SOCIALS = [
  {
    icon: Linkedin,
    title: "LinkedIn",
    desc: "Professional networking and career updates",
    link: "https://www.linkedin.com/in/rishi-nalem-8161b7244/",
    color: "#0A66C2",
  },
  {
    icon: Github,
    title: "GitHub",
    desc: "Open source projects and code repositories",
    link: "https://github.com/pranayrishi",
    color: "#F0F0F0",
  },
  {
    icon: Youtube,
    title: "YouTube",
    desc: "Project demos and tutorials",
    link: "https://www.youtube.com/@programmingwithrishinalem",
    color: "#FF0000",
  },
  {
    icon: BookOpen,
    title: "Medium",
    desc: "Technical articles and insights",
    link: "https://medium.com/@pranayrishi.nalem",
    color: "#00AB6C",
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("pranayrishi.nalem@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // 3D tilt effect for cards
  const handleCardMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * 20,
      rotateX: -y * 20,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from(".contact-word", {
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

      // Cards stagger
      gsap.from(".contact-social-card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-social-card",
          start: "top 85%",
        },
      });

      // SVG lines
      const lines = document.querySelectorAll(".contact-svg-line");
      lines.forEach((line) => {
        const length = (line as SVGPathElement).getTotalLength?.() || 200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path className="contact-svg-line" d="M 15 30 Q 30 50 50 40 T 85 55" fill="none" stroke="var(--plasma)" strokeWidth="0.15" opacity="0.2" />
        <path className="contact-svg-line" d="M 10 60 Q 40 45 60 55 T 90 35" fill="none" stroke="var(--plasma)" strokeWidth="0.1" opacity="0.15" />
        <path className="contact-svg-line" d="M 20 80 Q 50 60 70 70 T 95 50" fill="none" stroke="var(--amber)" strokeWidth="0.1" opacity="0.1" />
      </svg>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: headline */}
          <div>
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase mb-6 block"
              style={{
                color: "var(--plasma)",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              Let&apos;s Connect
            </span>

            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold italic leading-tight mb-8"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
              }}
            >
              <div className="overflow-hidden">
                <span className="contact-word block" style={{ color: "var(--text-bright)" }}>
                  Ready to Build
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="contact-word block" style={{ color: "var(--text-bright)" }}>
                  Something
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="contact-word block" style={{ color: "var(--plasma)" }}>
                  Extraordinary?
                </span>
              </div>
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "var(--text-mid)" }}
            >
              Whether you&apos;re looking for a dedicated developer, robotics
              engineer, or someone passionate about AI and innovation — let&apos;s
              talk.
            </p>

            {/* Email with copy */}
            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
              }}
            >
              <span
                className="text-sm md:text-base font-medium tracking-wide"
                style={{
                  color: "var(--plasma)",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                pranayrishi.nalem@gmail.com
              </span>
              {copied ? (
                <Check size={16} style={{ color: "var(--plasma)" }} />
              ) : (
                <Copy
                  size={16}
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{ color: "var(--text-dim)" }}
                />
              )}
            </button>
            {copied && (
              <span
                className="block mt-2 text-xs"
                style={{ color: "var(--plasma)" }}
              >
                Copied to clipboard!
              </span>
            )}
          </div>

          {/* Right: social cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-card p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--shadow)",
                  border: "1px solid var(--border-faint)",
                  perspective: "800px",
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: "var(--plasma-dim)",
                    color: "var(--plasma)",
                  }}
                >
                  <social.icon size={22} />
                </div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--text-bright)",
                  }}
                >
                  {social.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-mid)" }}
                >
                  {social.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
