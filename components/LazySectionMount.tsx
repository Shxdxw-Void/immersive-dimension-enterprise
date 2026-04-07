"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type LazySectionMountProps = {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
};

export default function LazySectionMount({
  children,
  fallback = null,
  className,
}: LazySectionMountProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = anchorRef.current;

    if (!node) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={anchorRef}
      className={className}
      data-heavy="true"
      data-lazy-section="true"
    >
      {shouldRender ? children : fallback}
    </div>
  );
}
