"use client";

import { useEffect } from "react";

type NavigatorConnection = {
  saveData?: boolean;
};

export default function PerformanceGuard() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    const saveData = connection?.saveData === true;
    const lowThreads = (navigator.hardwareConcurrency || 8) <= 4;
    const lowMemory =
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8) <= 4;
    const isLowPowerDevice =
      prefersReducedMotion || saveData || lowThreads || lowMemory;

    html.dataset.performance = isLowPowerDevice ? "low" : "high";
    body.classList.toggle("reduced-motion", isLowPowerDevice);

    const observers: IntersectionObserver[] = [];
    const media = Array.from(
      document.querySelectorAll("video, iframe"),
    ) as Array<HTMLVideoElement | HTMLIFrameElement>;

    if ("IntersectionObserver" in window && media.length > 0) {
      const mediaObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLVideoElement | HTMLIFrameElement;

            if (el.tagName === "VIDEO") {
              const video = el as HTMLVideoElement;

              if (entry.isIntersecting) {
                if (video.dataset.autopause === "true") {
                  void video.play().catch(() => {});
                  delete video.dataset.autopause;
                }
              } else if (!video.paused) {
                video.dataset.autopause = "true";
                video.pause();
              }

              video.preload = "metadata";
            }

            if (el.tagName === "IFRAME") {
              const iframe = el as HTMLIFrameElement;
              iframe.loading = "lazy";
            }
          }
        },
        { threshold: 0.15, rootMargin: "220px 0px" },
      );

      media.forEach((el) => mediaObserver.observe(el));
      observers.push(mediaObserver);
    }

    const heavyNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-heavy='true']"),
    );

    if (isLowPowerDevice) {
      heavyNodes.forEach((node) => {
        node.dataset.performanceMode = "reduced";
        node.style.willChange = "auto";
      });
    } else {
      heavyNodes.forEach((node) => {
        delete node.dataset.performanceMode;
      });
    }

    const cleanupTimer = window.setTimeout(() => {
      const animated = document.querySelectorAll<HTMLElement>("[style*='will-change']");

      animated.forEach((el) => {
        el.style.willChange = "auto";
      });
    }, 500);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.clearTimeout(cleanupTimer);
    };
  }, []);

  return null;
}
