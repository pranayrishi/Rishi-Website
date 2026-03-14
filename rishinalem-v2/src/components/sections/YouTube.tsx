"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { Play, Eye, Calendar } from "lucide-react";

const VIDEOS = [
  {
    title: "How I Built an AI-Powered Robot Arm",
    thumbnail: "/images/projects/Rishi_Robot.png",
    url: "https://www.youtube.com/watch?v=CBZo3_qBZF0",
    views: "2.1K",
    date: "2023",
    duration: "12:34",
  },
  {
    title: "Voice-Controlled Ping Pong Game with Alan AI",
    thumbnail: "/images/projects/Alan_Pong.png",
    url: "https://www.youtube.com/watch?v=ODQWSnVnlJk",
    views: "1.8K",
    date: "2022",
    duration: "8:21",
  },
  {
    title: "Building a GitHub FAQ Bot with AI",
    thumbnail: "/images/projects/Github_FAQ.png",
    url: "https://www.youtube.com/watch?v=w79sVJ-q-Tc",
    views: "950",
    date: "2022",
    duration: "10:15",
  },
  {
    title: "Microbit Encryption: Caesar Cipher System",
    thumbnail: "/images/projects/Microbit_Encrypt_Decrypt.png",
    url: "https://www.youtube.com/watch?v=bIt3S9f6cc0",
    views: "1.2K",
    date: "2023",
    duration: "7:45",
  },
  {
    title: "Flutter App Development: Dillman's Antiquities",
    thumbnail: "/images/projects/Dillmans_App.png",
    url: "https://www.youtube.com/watch?v=5Q0CJFjN8Tc",
    views: "800",
    date: "2023",
    duration: "15:02",
  },
  {
    title: "Smart Health Survey: AI Recommendations",
    thumbnail: "/images/projects/Hella_Healthy_Picture.png",
    url: "https://www.youtube.com/watch?v=bBYx4afhzqA",
    views: "650",
    date: "2022",
    duration: "9:33",
  },
];

export default function YouTube() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".yt-card", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".yt-grid",
          start: "top 80%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="youtube"
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
            Video Content
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic mb-6"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Latest Videos
          </h2>

          {/* Channel info */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#ff0000" }}
            >
              <Play size={18} fill="white" color="white" />
            </div>
            <div className="text-left">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-bright)" }}
              >
                Programming with Rishi Nalem
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--text-dim)" }}
              >
                @programmingwithrishinalem
              </p>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="yt-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {VIDEOS.map((video, i) => (
            <a
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-card group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "var(--shadow)",
                border: "1px solid var(--border-faint)",
              }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(255,0,0,0.9)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Play size={22} fill="white" color="white" />
                  </div>
                </div>
                {/* Duration badge */}
                <span
                  className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3
                  className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[var(--plasma)] transition-colors duration-300"
                  style={{ color: "var(--text-bright)" }}
                >
                  {video.title}
                </h3>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--text-dim)" }}
                >
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {video.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {video.date}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@programmingwithrishinalem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "#ff0000",
              color: "white",
            }}
          >
            <Play size={16} fill="white" />
            Subscribe to My Channel
          </a>
        </div>
      </div>
    </section>
  );
}
