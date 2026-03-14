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
  publishedAt: string;
}

// Fallback videos in case API fails
const FALLBACK_VIDEOS: Video[] = [
  {
    id: "CBZo3_qBZF0",
    title: "How I Built an AI-Powered Robot Arm",
    thumbnail: "/images/projects/Rishi_Robot.png",
    url: "https://www.youtube.com/watch?v=CBZo3_qBZF0",
    views: "2.1K",
    date: "2023",
    publishedAt: "2023-04-01",
  },
  {
    id: "ODQWSnVnlJk",
    title: "Voice-Controlled Ping Pong Game with Alan AI",
    thumbnail: "/images/projects/Alan_Pong.png",
    url: "https://www.youtube.com/watch?v=ODQWSnVnlJk",
    views: "1.8K",
    date: "2022",
    publishedAt: "2022-06-01",
  },
  {
    id: "w79sVJ-q-Tc",
    title: "Building a GitHub FAQ Bot with AI",
    thumbnail: "/images/projects/Github_FAQ.png",
    url: "https://www.youtube.com/watch?v=w79sVJ-q-Tc",
    views: "950",
    date: "2022",
    publishedAt: "2022-07-01",
  },
  {
    id: "bIt3S9f6cc0",
    title: "Microbit Encryption: Caesar Cipher System",
    thumbnail: "/images/projects/Microbit_Encrypt_Decrypt.png",
    url: "https://www.youtube.com/watch?v=bIt3S9f6cc0",
    views: "1.2K",
    date: "2023",
    publishedAt: "2023-04-01",
  },
  {
    id: "5Q0CJFjN8Tc",
    title: "Flutter App Development: Dillman's Antiquities",
    thumbnail: "/images/projects/Dillmans_App.png",
    url: "https://www.youtube.com/watch?v=5Q0CJFjN8Tc",
    views: "800",
    date: "2023",
    publishedAt: "2023-06-01",
  },
  {
    id: "bBYx4afhzqA",
    title: "Smart Health Survey: AI Recommendations",
    thumbnail: "/images/projects/Hella_Healthy_Picture.png",
    url: "https://www.youtube.com/watch?v=bBYx4afhzqA",
    views: "650",
    date: "2022",
    publishedAt: "2022-07-01",
  },
];

function formatViews(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return count;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function YouTube() {
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        // Get channel ID from handle
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelRes.json();
        const channelId = channelData.items?.[0]?.snippet?.channelId;
        if (!channelId) throw new Error("Channel not found");

        // Get latest videos
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosRes.json();
        if (!videosData.items?.length) throw new Error("No videos found");

        const videoIds = videosData.items.map((v: { id: { videoId: string } }) => v.id.videoId).join(",");

        // Get video statistics
        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const statsData = await statsRes.json();

        const fetchedVideos: Video[] = videosData.items.map(
          (item: { id: { videoId: string }; snippet: { title: string; thumbnails: { high: { url: string } }; publishedAt: string } }, i: number) => {
            const stats = statsData.items?.[i]?.statistics;
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              views: stats?.viewCount ? formatViews(stats.viewCount) : "—",
              date: formatDate(item.snippet.publishedAt),
              publishedAt: item.snippet.publishedAt,
            };
          }
        );

        setVideos(fetchedVideos);
      } catch {
        // Keep fallback videos
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <section
      id="youtube"
      className="section-padding relative"
      style={{ background: "var(--void)" }}
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-20">
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold italic mb-8"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--text-bright)",
            }}
          >
            Latest Videos
          </h2>

          {/* Channel info */}
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
            style={{ background: "var(--shadow)", border: "1px solid var(--border-faint)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#ff0000" }}
            >
              <Play size={14} fill="white" color="white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-bright)" }}>
                Programming with Rishi Nalem
              </p>
              <p className="text-xs leading-tight" style={{ color: "var(--text-dim)" }}>
                @programmingwithrishinalem
              </p>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--border-faint)", borderTopColor: "var(--plasma)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>Loading videos...</p>
          </div>
        )}

        {/* Video grid — always visible, no GSAP opacity animation */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--shadow)",
                  border: "1px solid var(--border-faint)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-glow)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,148,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-faint)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {video.thumbnail.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                      style={{ background: "rgba(255,0,0,0.9)" }}
                    >
                      <Play size={18} fill="white" color="white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3
                    className="text-sm font-semibold mb-3 leading-snug group-hover:text-[var(--plasma)] transition-colors duration-300"
                    style={{
                      color: "var(--text-bright)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-dim)" }}>
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      {video.views} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {video.date}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="text-center mt-14">
          <a
            href="https://www.youtube.com/@programmingwithrishinalem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg whitespace-nowrap"
            style={{
              background: "#ff0000",
              color: "white",
              padding: "14px 32px",
            }}
          >
            <Play size={14} fill="white" />
            Subscribe to My Channel
          </a>
        </div>
      </div>
    </section>
  );
}
