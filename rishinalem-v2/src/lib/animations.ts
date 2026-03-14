"use client";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export function scrambleText(
  element: HTMLElement,
  finalText: string,
  duration = 600
) {
  const startTime = Date.now();

  function update() {
    const progress = (Date.now() - startTime) / duration;
    const revealUpTo = Math.floor(progress * finalText.length);

    let result = "";
    for (let i = 0; i < finalText.length; i++) {
      if (i < revealUpTo) {
        result += finalText[i];
      } else if (finalText[i] === " ") {
        result += " ";
      } else {
        result +=
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }

    element.textContent = result;

    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = finalText;
  }

  requestAnimationFrame(update);
}

export function animateCounter(
  el: HTMLElement,
  target: number,
  duration = 2000,
  suffix = ""
) {
  const start = Date.now();

  function update() {
    const progress = Math.min((Date.now() - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
