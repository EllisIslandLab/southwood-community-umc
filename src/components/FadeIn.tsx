"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // jsReady: JS has mounted, so it's now safe to opt into the hidden state.
  // Stays false (content stays visible, no animation) if hydration never
  // completes for any reason.
  const [jsReady, setJsReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        } else {
          // Only hide if it's not already on screen — avoids a hide-then-
          // reveal flash for content visible at initial load.
          setJsReady(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = ["fade-in-up", jsReady && "js-ready", visible && "is-visible", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
