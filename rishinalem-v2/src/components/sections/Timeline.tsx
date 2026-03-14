"use client";

const EVENTS = [
  { year: 2018, title: "Started Programming", desc: "Began my journey learning Python, discovering the world of code and building my first programs." },
  { year: 2019, title: "First Robotics Build", desc: "Built my first robot with Arduino, sparking a lifelong passion for hardware and engineering." },
  { year: 2020, title: "VEX IQ Competitions", desc: "Competed in robotics tournaments, honing design thinking and strategic problem-solving skills." },
  { year: 2021, title: "Mobile App Development", desc: "Created my first Flutter mobile app, entering the world of cross-platform development." },
  { year: 2022, title: "Alan AI Internship", desc: "Joined Alan AI, building voice-enabled applications and pioneering AI integration in software." },
  { year: 2023, title: "AI Robot Arm + Nonprofit", desc: "Built an AI-powered robot arm with computer vision and founded Nalem Study Circle nonprofit." },
  { year: 2024, title: "Advanced Systems", desc: "Developed complex Raspberry Pi systems and advanced autonomous robotics projects." },
  { year: 2025, title: "The Future...", desc: "Continuing to push the boundaries of AI, robotics, and innovation." },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="relative"
      style={{ background: "var(--ink)", padding: "8rem 0" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}>
        {/* Section header — large bottom margin to prevent overlap */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
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
            The Journey
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
            My Timeline
          </h2>
        </div>

        {/* Timeline container */}
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 23,
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--plasma)",
              opacity: 0.2,
            }}
          />

          {/* Event cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {EVENTS.map((event) => (
              <div
                key={event.year}
                style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}
              >
                {/* Dot + year column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 48,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--plasma)",
                      boxShadow: "0 0 12px var(--plasma-dim)",
                      marginTop: 6,
                    }}
                  />
                  <span
                    style={{
                      marginTop: 8,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--plasma)",
                      fontFamily: "var(--font-jetbrains), monospace",
                    }}
                  >
                    {event.year}
                  </span>
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    padding: "1.5rem 2rem",
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
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginBottom: 8,
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "var(--text-bright)",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: "var(--text-mid)",
                    }}
                  >
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
