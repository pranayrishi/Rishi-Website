"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useReveal(selector: string) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          {
            y: 60,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "expo.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [selector]);
}
