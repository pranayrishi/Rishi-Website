"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { useScramble } from "@/hooks/useScramble";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Timeline", href: "#timeline" },
  { label: "Projects", href: "#projects" },
  { label: "Nonprofit", href: "#nonprofit" },
  { label: "YouTube", href: "#youtube" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const logoRef = useRef<HTMLAnchorElement>(null);
  const scramble = useScramble();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 ${
        scrolled
          ? "w-auto px-6 py-3 rounded-full backdrop-blur-2xl border"
          : "w-[calc(100%-4rem)] max-w-[1400px] px-8 py-4 rounded-2xl"
      }`}
      style={{
        background: scrolled
          ? "rgba(12,12,16,0.85)"
          : "rgba(12,12,16,0.4)",
        borderColor: scrolled
          ? "var(--border-faint)"
          : "transparent",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex items-center justify-between gap-8">
        {/* Logo */}
        <a
          ref={logoRef}
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          onMouseEnter={() =>
            scramble(logoRef.current, "Rishi Nalem", 400)
          }
          className="text-lg font-semibold whitespace-nowrap"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "var(--text-bright)",
          }}
        >
          Rishi Nalem
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 hover:bg-white/5"
              style={{
                color:
                  activeSection === link.href
                    ? "var(--plasma)"
                    : "var(--text-mid)",
              }}
            >
              {link.label}
              {activeSection === link.href && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--plasma)" }}
                />
              )}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          className="hidden md:inline-flex px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
          style={{
            border: "1px solid var(--plasma)",
            color: "var(--plasma)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "var(--plasma)";
            el.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = "var(--plasma)";
          }}
        >
          Hire Me
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--text-bright)",
              transform: mobileOpen
                ? "rotate(45deg) translate(3px, 3px)"
                : "none",
            }}
          />
          <span
            className="w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--text-bright)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--text-bright)",
              transform: mobileOpen
                ? "rotate(-45deg) translate(3px, -3px)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 pb-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300"
              style={{
                color:
                  activeSection === link.href
                    ? "var(--plasma)"
                    : "var(--text-mid)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="mx-4 mt-2 px-5 py-2 rounded-full text-sm font-semibold text-center"
            style={{
              border: "1px solid var(--plasma)",
              color: "var(--plasma)",
            }}
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
}
