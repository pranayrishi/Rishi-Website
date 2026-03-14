"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Eye, Calendar } from "lucide-react";

const YOUTUBE_API_KEY = "AIzaSyBNZiw7ZG-OzMb4G1UKWp5k1QH8tqD81Hc";
const CHANNEL_HANDLE = "@programmingwithrishinalem";
const MAX_RESULTS = 6;

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: string;
  date: string;
}

const FALLBACK_VIDEOS: Video[] = [
  { id: "CBZo3_qBZF0", title: "How I Built an AI-Powered Robot Arm", thumbnail: "/images/projects/Rishi_Robot.png", url: "https://www.youtube.com/watch?v=CBZo3_qBZF0", views: "2.1K", date: "2023" },
  { id: "ODQWSnVnlJk", title: "Voice-Controlled Ping Pong Game with Alan AI", thumbnail: "/images/projects/Alan_Pong.png", url: "https://www.youtube.com/watch?v=ODQWSnVnlJk", views: "1.8K", date: "2022" },
  { id: "w79sVJ-q-Tc", title: "Building a GitHub FAQ Bot with AI", thumbnail: "/images/projects/Github_FAQ.png", url: "https://www.youtube.com/watch?v=w79sVJ-q-Tc", views: "950", date: "2022" },
  { id: "bIt3S9f6cc0", title: "Microbit Encryption: Caesar Cipher System", thumbnail: "/images/projects/Microbit_Encrypt_Decrypt.png", url: "https://www.youtube.com/watch?v=bIt3S9f6cc0", views: "1.2K", date: "2023" },
  { id: "5Q0CJFjN8Tc", title: "Flutter App: Dillman's Antiquities", thumbnail: "/images/projects/Dillmans_App.png", url: "https://www.youtube.com/watch?v=5Q0CJFjN8Tc", views: "800", date: "2023" },
  { id: "bBYx4afhzqA", title: "Smart Health Survey: AI Recommendations", thumbnail: "/images/projects/Hella_Healthy_Picture.png", url: "https://www.youtube.com/watch?v=bBYx4afhzqA", views: "650", date: "2022" },
];

function formatViews(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return count;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function YouTube() {
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const chRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`);
        const chData = await chRes.json();
        const channelId = chData.items?.[0]?.snippet?.channelId;
        if (!channelId) return;

        const vRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${YOUTUBE_API_KEY}`);
        const vData = await vRes.json();
        if (!vData.items?.length) return;

        const ids = vData.items.map((v: { id: { videoId: string } }) => v.id.videoId).join(",");
        const sRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${YOUTUBE_API_KEY}`);
        const sData = await sRes.json();

        setVideos(vData.items.map((item: { id: { videoId: string }; snippet: { title: string; thumbnails: { high: { url: string } }; publishedAt: string } }, i: number) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          views: sData.items?.[i]?.statistics?.viewCount ? formatViews(sData.items[i].statistics.viewCount) : "—",
          date: formatDate(item.snippet.publishedAt),
        })));
      } catch { /* keep fallback */ }
    }
    fetchVideos();
  }, []);

  return (
    <section id="youtube" style={{ background: "var(--void)", padding: "8rem 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem", color: "var(--plasma)", fontFamily: "var(--font-jetbrains), monospace" }}>
            Video Content
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: 700, fontStyle: "italic", fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-bright)", lineHeight: 1.1, marginBottom: "2rem" }}>
            Latest Videos
          </h2>
          {/* Channel badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 9999, background: "var(--shadow)", border: "1px solid var(--border-faint)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Play size={14} fill="white" color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-bright)", lineHeight: 1.3 }}>Programming with Rishi Nalem</p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", lineHeight: 1.3 }}>@programmingwithrishinalem</p>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", borderRadius: 16, overflow: "hidden", background: "var(--shadow)", border: "1px solid var(--border-faint)", textDecoration: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,148,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-faint)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Thumbnail */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "var(--mist)" }}>
                {video.thumbnail.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                )}
              </div>
              {/* Info */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 10, color: "var(--text-bright)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {video.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Eye size={12} />{video.views} views</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{video.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Subscribe */}
        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <a
            href="https://www.youtube.com/@programmingwithrishinalem"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 32px", borderRadius: 9999, background: "#ff0000", color: "white", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Play size={14} fill="white" />
            Subscribe to My Channel
          </a>
        </div>
      </div>
    </section>
  );
}
