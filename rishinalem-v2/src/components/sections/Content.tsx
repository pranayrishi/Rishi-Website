"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ExternalLink, PenLine, MessageCircle, HelpCircle } from "lucide-react";

const PLATFORMS = [
  {
    icon: PenLine,
    title: "Medium Articles",
    desc: "In-depth technical articles, tutorials, and insights about software development, AI, and robotics.",
    link: "https://medium.com/@pranayrishi.nalem",
    cta: "Read Articles",
  },
  {
    icon: MessageCircle,
    title: "Reddit Community",
    desc: "Active participation in tech communities — sharing projects, answering questions, and discussions.",
    link: "https://www.reddit.com/r/PranayRishiNalem/",
    cta: "Join Discussion",
  },
  {
    icon: HelpCircle,
    title: "Quora Insights",
    desc: "Detailed answers to technology questions, sharing expertise in programming, robotics, and AI.",
    link: "https://www.quora.com/profile/Rishi-Nalem",
    cta: "View Answers",
  },
];

export default function Content() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".content-card", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".content-card",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="content"
      ref={sectionRef}
      className="section-padding"
      style={{ background: "var(--ink)" }}
    >
      <div className="container-wide">
        <div className="text-center mb-16">
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase mb-4 block"
            style={{
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Knowledge Sharing
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Content & Community
          </h2>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden mb-12 py-4">
          <div className="flex gap-8 animate-marquee-slow whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-6xl md:text-8xl font-bold italic opacity-5"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                WRITE · TEACH · SHARE · GROW ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLATFORMS.map((platform) => (
            <a
              key={platform.title}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="content-card group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0,255,148,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "var(--plasma-dim)",
                  color: "var(--plasma)",
                }}
              >
                <platform.icon size={22} />
              </div>

              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                {platform.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-mid)" }}
              >
                {platform.desc}
              </p>

              <span
                className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2"
                style={{ color: "var(--plasma)" }}
              >
                {platform.cta}
                <ExternalLink size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
