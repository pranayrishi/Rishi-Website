"use client";

import { ExternalLink, Monitor, Mic, Shield, Cpu, Sparkles, Zap } from "lucide-react";

const FEATURES = [
  { icon: Monitor, title: "Multi-App Control", desc: "Works with any app visible on screen — Google Docs, Spotify, Excel, Slack, Figma, and 20+ more." },
  { icon: Mic, title: "Voice & Text", desc: "Speak or type any task — from simple to complex multi-step workflows." },
  { icon: Shield, title: "Privacy-First", desc: "No accounts, no telemetry, no tracking. All AI runs locally on your hardware." },
  { icon: Cpu, title: "Local Processing", desc: "Zero cloud dependency. No network latency. Your data never leaves your device." },
  { icon: Sparkles, title: "Self-Learning", desc: "Learns your workflows over time, improving speed and efficiency with repeated use." },
  { icon: Zap, title: "Zero Setup", desc: "No plugins, no API keys, no configuration. Just install and start automating." },
];

export default function Startup() {
  return (
    <section id="startup" style={{ background: "var(--ink)", padding: "8rem 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle gradient accent */}
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,148,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem", color: "var(--plasma)", fontFamily: "var(--font-jetbrains), monospace" }}>
            My Startup
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: 700, fontStyle: "italic", fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-bright)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            SattvaAI
          </h2>
          <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--plasma)", marginBottom: "1.5rem", fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}>
            Your AI. Any App. Zero Setup.
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-mid)", maxWidth: 620, margin: "0 auto" }}>
            SattvaAI is a local, private AI agent that automates tasks across any application on your computer — without plugins, API keys, or cloud connectivity. Just describe what you want done in natural language.
          </p>
        </div>

        {/* Features grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "1.5rem",
            maxWidth: 1000,
            margin: "0 auto 4rem",
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "2rem",
                borderRadius: 16,
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,148,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  background: "var(--plasma-dim)",
                  color: "var(--plasma)",
                }}
              >
                <feature.icon size={20} />
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: 8,
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "var(--text-bright)",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-mid)" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
            padding: "2rem",
            borderRadius: 16,
            background: "var(--shadow)",
            border: "1px solid var(--border-faint)",
            maxWidth: 600,
            margin: "0 auto 3rem",
          }}
        >
          {[
            { value: "4.9", label: "Star Rating" },
            { value: "1,200+", label: "Users" },
            { value: "Free", label: "Forever" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--plasma)", fontFamily: "var(--font-playfair), Georgia, serif", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-dim)", fontFamily: "var(--font-jetbrains), monospace" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://sattva-ai-website.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 36px",
              borderRadius: 9999,
              background: "var(--plasma)",
              color: "var(--ink)",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,148,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explore SattvaAI
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
