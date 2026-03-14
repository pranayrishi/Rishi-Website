"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { AnimatePresence, motion } from "framer-motion";
import { X, Github, Youtube, ExternalLink } from "lucide-react";
import Image from "next/image";

const PROJECTS = [
  {
    id: 1,
    num: "01",
    title: "Alan AI Ping Pong Game",
    tags: ["JavaScript", "Alan AI", "Voice Recognition"],
    year: "2022",
    image: "/images/projects/Alan_Pong.png",
    desc: "Revolutionary voice-enabled ping pong game developed during my Alan AI internship, featuring advanced voice assistant integration and real-time game control through natural language commands.",
    github: "https://github.com/pranayrishi/Alan-AI-Ping-Pong-Game",
    youtube: "https://www.youtube.com/watch?v=ODQWSnVnlJk",
  },
  {
    id: 2,
    num: "02",
    title: "GitHub FAQ Application",
    tags: ["Alan AI", "GitHub API", "NLP"],
    year: "2022",
    image: "/images/projects/Github_FAQ.png",
    desc: "Intelligent GitHub application using Alan AI that helps companies reduce call wait times by automating FAQ responses with natural language processing and voice interaction.",
    github: "https://github.com/pranayrishi/Alan-AI-Github-FAQ-Project",
    youtube: "https://www.youtube.com/watch?v=w79sVJ-q-Tc",
  },
  {
    id: 3,
    num: "03",
    title: "AI-Powered Robot Arm",
    tags: ["Arduino", "Raspberry Pi", "Computer Vision"],
    year: "2023",
    image: "/images/projects/Rishi_Robot.png",
    desc: "Advanced AI-enabled robotic arm built with Arduino and Raspberry Pi, featuring computer vision, autonomous control, and precise manipulation capabilities.",
    youtube: "https://www.youtube.com/watch?v=CBZo3_qBZF0",
  },
  {
    id: 4,
    num: "04",
    title: "Microbit Caesar Cipher",
    tags: ["Microbit", "Cryptography", "Radio"],
    year: "2023",
    image: "/images/projects/Microbit_Encrypt_Decrypt.png",
    desc: "Sophisticated encryption and decryption system using Microbit with radio technology for secure data transmission, implementing classical cryptography with modern hardware.",
    github: "https://github.com/pranayrishi/Radio-Communication-Encryption",
    youtube: "https://www.youtube.com/watch?v=bIt3S9f6cc0",
  },
  {
    id: 5,
    num: "05",
    title: "Dillman's Antiquities App",
    tags: ["Flutter", "Dart", "Mobile", "UI/UX"],
    year: "2023",
    image: "/images/projects/Dillmans_App.png",
    desc: "Comprehensive Flutter mobile application for an antique marketplace, improving buyer-seller communication by 10% with intuitive UI design.",
    github: "https://github.com/pranayrishi/Dillman-s-Emporium-App",
    youtube: "https://www.youtube.com/watch?v=5Q0CJFjN8Tc",
  },
  {
    id: 6,
    num: "06",
    title: "Hella Healthy Essentials",
    tags: ["Algorithm Design", "Data Analysis", "Web"],
    year: "2022",
    image: "/images/projects/Hella_Healthy_Picture.png",
    desc: "Intelligent product recommendation survey system that improved product matching accuracy by 20%, utilizing advanced algorithms for personalized health recommendations.",
    youtube: "https://www.youtube.com/watch?v=bBYx4afhzqA",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<(typeof PROJECTS)[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const imgPosRef = useRef({ x: 0, y: 0 });

  // Hover image follow cursor
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    let raf: number;
    const animate = () => {
      imgPosRef.current.x += (mouseRef.current.x - imgPosRef.current.x) * 0.07;
      imgPosRef.current.y += (mouseRef.current.y - imgPosRef.current.y) * 0.07;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${imgPosRef.current.x - 180}px, ${imgPosRef.current.y - 120}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".projects-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".project-row", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".project-row",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative"
      style={{ background: "var(--void)" }}
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
            Portfolio
          </span>
          <h2
            className="projects-title text-4xl md:text-6xl lg:text-7xl font-bold italic"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Featured Projects
          </h2>
        </div>

        {/* Project rows */}
        <div className="max-w-5xl mx-auto">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="project-row group border-b py-6 flex items-center justify-between gap-4 transition-all duration-300"
              style={{
                borderColor: "var(--border-faint)",
                opacity: hoveredId && hoveredId !== project.id ? 0.35 : 1,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelected(project)}
            >
              <div className="flex items-center gap-4 md:gap-8">
                <span
                  className="text-sm font-medium w-8"
                  style={{
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {project.num}
                </span>
                <h3
                  className="text-xl md:text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--plasma)]"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--text-bright)",
                  }}
                >
                  {project.title}
                </h3>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "var(--plasma-dim)",
                        color: "var(--plasma)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {project.year}
                </span>
                <span
                  className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: "var(--plasma)" }}
                >
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover image (desktop) */}
      {hoveredId && (
        <div
          ref={imgRef}
          className="fixed top-0 left-0 z-50 pointer-events-none hidden md:block"
          style={{
            width: 360,
            height: 240,
          }}
        >
          <div className="w-full h-full rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-faint)" }}>
            <Image
              src={PROJECTS.find((p) => p.id === hoveredId)?.image || ""}
              alt=""
              fill
              className="object-cover"
              sizes="360px"
            />
          </div>
        </div>
      )}

      {/* Full-screen project detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[2000] overflow-y-auto"
            style={{ background: "var(--ink)" }}
          >
            <div className="min-h-screen p-8 md:p-16">
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-110"
                style={{
                  background: "var(--shadow)",
                  border: "1px solid var(--border-faint)",
                  color: "var(--text-bright)",
                }}
              >
                <X size={20} />
              </button>

              {/* Project hero image */}
              <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden mb-12 mt-12">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>

              <div className="max-w-3xl mx-auto">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "var(--plasma-dim)",
                        color: "var(--plasma)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2
                  className="text-4xl md:text-6xl font-bold italic mb-4"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "var(--text-bright)",
                  }}
                >
                  {selected.title}
                </h2>

                <p
                  className="text-base md:text-lg leading-relaxed mb-8"
                  style={{ color: "var(--text-mid)" }}
                >
                  {selected.desc}
                </p>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "var(--shadow)",
                        border: "1px solid var(--border-faint)",
                        color: "var(--text-bright)",
                      }}
                    >
                      <Github size={16} />
                      View Code
                    </a>
                  )}
                  {selected.youtube && (
                    <a
                      href={selected.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "#ff0000",
                        color: "white",
                      }}
                    >
                      <Youtube size={16} />
                      Watch Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
