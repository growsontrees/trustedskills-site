"use client";

import { useEffect, useRef } from "react";

async function fetchBuildId(): Promise<string | null> {
  try {
    const res = await fetch(`/__build.json?ts=${Date.now()}`, {
      cache: "no-store",
      headers: { "cache-control": "no-cache" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { buildId?: string };
    return typeof data.buildId === "string" ? data.buildId : null;
  } catch {
    return null;
  }
}

export function BuildVersionGuard({ buildId }: { buildId: string }) {
  const checkingRef = useRef(false);
  const reloadingRef = useRef(false);

  useEffect(() => {
    async function check(reason: string) {
      if (!buildId || checkingRef.current || reloadingRef.current) return;
      checkingRef.current = true;
      try {
        const latestBuildId = await fetchBuildId();
        if (!latestBuildId || latestBuildId === buildId) return;

        reloadingRef.current = true;
        console.warn(`[build-guard] Reloading stale client on ${reason}: ${buildId} -> ${latestBuildId}`);
        window.location.reload();
      } finally {
        checkingRef.current = false;
      }
    }

    const onFocus = () => void check("focus");
    const onVisibility = () => {
      if (document.visibilityState === "visible") void check("visibility");
    };
    const onPageshow = () => void check("pageshow");

    const interval = window.setInterval(() => void check("interval"), 15000);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageshow);
    document.addEventListener("visibilitychange", onVisibility);
    void check("mount");

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageshow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [buildId]);

  return null;
}
