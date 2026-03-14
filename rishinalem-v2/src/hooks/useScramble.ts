"use client";

import { useCallback, useRef } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export function useScramble() {
  const rafRef = useRef<number>(0);

  const scramble = useCallback(
    (element: HTMLElement | null, finalText: string, duration = 600) => {
      if (!element) return;
      cancelAnimationFrame(rafRef.current);
      const startTime = Date.now();

      function update() {
        if (!element) return;
        const progress = (Date.now() - startTime) / duration;
        const revealUpTo = Math.floor(progress * finalText.length);
        let result = "";
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealUpTo) {
            result += finalText[i];
          } else if (finalText[i] === " ") {
            result += " ";
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        element.textContent = result;
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(update);
        } else {
          element.textContent = finalText;
        }
      }

      rafRef.current = requestAnimationFrame(update);
    },
    []
  );

  return scramble;
}
