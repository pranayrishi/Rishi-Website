"use client";

import { useRef } from "react";
import { useScramble } from "@/hooks/useScramble";
import { getLenis } from "@/lib/scroll";
import { ArrowUp, Github, Linkedin, Youtube, BookOpen } from "lucide-react";

const SOCIALS = [
  {
    icon: Github,
    href: "https://github.com/pranayrishi",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/rishi-nalem-8161b7244/",
    label: "LinkedIn",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@programmingwithrishinalem",
    label: "YouTube",
  },
  {
    icon: BookOpen,
    href: "https://medium.com/@pranayrishi.nalem",
    label: "Medium",
  },
];

export default function Footer() {
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const scramble = useScramble();

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative py-16 border-t"
      style={{
        background: "var(--ink)",
        borderColor: "var(--border-faint)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 text-center">
        <p
          ref={line1Ref}
          onMouseEnter={() =>
            scramble(
              line1Ref.current,
              "Rishi Nalem · Software Developer · Robotics Engineer · AI Innovator",
              600
            )
          }
          className="text-sm mb-3"
          style={{
            color: "var(--text-mid)",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          Rishi Nalem · Software Developer · Robotics Engineer · AI Innovator
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-dim)" }}>
          &copy; 2025 · Built with passion in California
        </p>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: "var(--void)",
                border: "1px solid var(--border-faint)",
                color: "var(--text-mid)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--plasma)";
                e.currentTarget.style.color = "var(--plasma)";
                e.currentTarget.style.boxShadow =
                  "0 0 20px var(--plasma-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-faint)";
                e.currentTarget.style.color = "var(--text-mid)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-[-15deg]"
        style={{
          background: "transparent",
          border: "1px solid var(--plasma)",
          color: "var(--plasma)",
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
