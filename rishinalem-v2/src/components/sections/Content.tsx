"use client";

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
    desc: "Active participation in tech communities — sharing projects, answering questions, and engaging in discussions.",
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
  return (
    <section id="content" style={{ background: "var(--ink)", padding: "8rem 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem", color: "var(--plasma)", fontFamily: "var(--font-jetbrains), monospace" }}>
            Knowledge Sharing
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: 700, fontStyle: "italic", fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-bright)", lineHeight: 1.1 }}>
            Content & Community
          </h2>
        </div>

        {/* Platform cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "1.5rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {PLATFORMS.map((platform) => (
            <a
              key={platform.title}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "2rem",
                borderRadius: 16,
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,148,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  background: "var(--plasma-dim)",
                  color: "var(--plasma)",
                }}
              >
                <platform.icon size={22} />
              </div>

              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: 10,
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                {platform.title}
              </h3>

              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, marginBottom: 20, color: "var(--text-mid)" }}>
                {platform.desc}
              </p>

              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontWeight: 600, color: "var(--plasma)" }}>
                {platform.cta}
                <ExternalLink size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
