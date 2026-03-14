"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/core/SmoothScroll";
import Preloader from "@/components/core/Preloader";
import Navbar from "@/components/core/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Timeline from "@/components/sections/Timeline";
import Projects from "@/components/sections/Projects";
import Nonprofit from "@/components/sections/Nonprofit";
import Press from "@/components/sections/Press";
import YouTube from "@/components/sections/YouTube";
import Content from "@/components/sections/Content";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/core/Footer";

const CustomCursor = dynamic(
  () => import("@/components/core/CustomCursor"),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Nonprofit />
        <Press />
        <YouTube />
        <Content />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
