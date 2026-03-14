import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Rishi Nalem — Software Developer, Robotics Engineer & AI Innovator",
  description:
    "Pranay Rishi Nalem — Building intelligent systems at the intersection of AI, robotics, and software engineering. Founder of Nalem Study Circle.",
  keywords: [
    "Rishi Nalem",
    "Software Developer",
    "Robotics Engineer",
    "AI",
    "Machine Learning",
    "Python",
    "JavaScript",
    "Flutter",
    "Arduino",
    "Raspberry Pi",
    "Nalem Study Circle",
  ],
  authors: [{ name: "Pranay Rishi Nalem" }],
  openGraph: {
    title: "Rishi Nalem — Software Developer & Robotics Engineer",
    description:
      "Building intelligent systems at the intersection of AI, robotics, and software engineering.",
    type: "website",
    url: "https://rishinalem.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishi Nalem — Software Developer & Robotics Engineer",
    description:
      "Building intelligent systems at the intersection of AI, robotics, and software engineering.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
