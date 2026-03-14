"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/scroll";
import { useScramble } from "@/hooks/useScramble";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Nonprofit", href: "#nonprofit" },
  { label: "Press", href: "#press" },
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
      className="fixed top-4 left-1/2 z-[1000]"
      style={{
        transform: "translateX(-50%)",
        width: scrolled ? "auto" : "calc(100% - 3rem)",
        maxWidth: scrolled ? "none" : "1400px",
        padding: scrolled ? "10px 24px" : "14px 32px",
        borderRadius: scrolled ? "9999px" : "16px",
        background: scrolled ? "rgba(12,12,16,0.9)" : "rgba(12,12,16,0.4)",
        border: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          ref={logoRef}
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          onMouseEnter={() => scramble(logoRef.current, "Rishi Nalem", 400)}
          className="text-lg font-semibold whitespace-nowrap shrink-0"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "var(--text-bright)",
          }}
        >
          Rishi Nalem
        </a>

        {/* Desktop links — properly spaced */}
        <div className="hidden lg:flex items-center ml-12 gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-300 whitespace-nowrap hover:bg-white/5"
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
                  className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: "var(--plasma)",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 ml-4"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "var(--text-bright)",
              transform: mobileOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--text-bright)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "var(--text-bright)",
              transform: mobileOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-1 pb-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300"
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
        </div>
      )}
    </nav>
  );
}
