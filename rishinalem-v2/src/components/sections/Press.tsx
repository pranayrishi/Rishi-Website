"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ExternalLink, Newspaper } from "lucide-react";

const ARTICLES = [
  {
    publication: "CanvasRebel",
    title: "Meet Pranay Rishi",
    excerpt:
      "An in-depth feature exploring Rishi's journey in software development, robotics engineering, and his passion for building technology that makes a difference.",
    url: "https://canvasrebel.com/meet-pranay-rishi/",
    color: "#E85D3A",
  },
  {
    publication: "BoldJourney",
    title: "Meet Pranay Rishi",
    excerpt:
      "A thoughtful profile covering Rishi's entrepreneurial mindset, his nonprofit work with Nalem Study Circle, and the innovations driving his career forward.",
    url: "https://boldjourney.com/meet-pranay-rishi/",
    color: "#2563EB",
  },
];

export default function Press() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".press-card", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".press-card",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="press"
      ref={sectionRef}
      className="section-padding relative"
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
            In The Press
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Featured In
          </h2>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {ARTICLES.map((article) => (
            <a
              key={article.publication}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-card group block p-8 md:p-10 rounded-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0,255,148,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Publication badge */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: article.color + "18",
                    color: article.color,
                  }}
                >
                  <Newspaper size={18} />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: article.color }}
                >
                  {article.publication}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-xl md:text-2xl font-bold mb-4 group-hover:text-[var(--plasma)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-mid)" }}
              >
                {article.excerpt}
              </p>

              {/* Read link */}
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                style={{ color: "var(--plasma)" }}
              >
                Read Article
                <ExternalLink size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
