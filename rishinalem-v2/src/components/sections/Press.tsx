"use client";

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
  return (
    <section
      id="press"
      style={{ background: "var(--void)", padding: "8rem 0" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "1rem",
              color: "var(--plasma)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            In The Press
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
              lineHeight: 1.1,
            }}
          >
            Featured In
          </h2>
        </div>

        {/* Article cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "2rem",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {ARTICLES.map((article) => (
            <a
              key={article.publication}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "2.5rem",
                borderRadius: 16,
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,255,148,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Publication badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: article.color + "18",
                    color: article.color,
                  }}
                >
                  <Newspaper size={18} />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: article.color,
                  }}
                >
                  {article.publication}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  marginBottom: 12,
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  marginBottom: 20,
                  color: "var(--text-mid)",
                }}
              >
                {article.excerpt}
              </p>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--plasma)",
                }}
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
