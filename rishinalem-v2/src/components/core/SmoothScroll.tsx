"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/scroll";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = initLenis();
    lenis.stop();

    return () => {
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
