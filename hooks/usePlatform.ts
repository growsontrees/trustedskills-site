"use client";
import { useState, useEffect, useCallback } from "react";
import type { PlatformKey } from "../lib/platform-install";

// The command generation lives in lib/platform-install.ts so server code (the
// docs pages) can call it too. Re-exported here: client components keep their
// existing imports, and there is still only one definition of each command.
export type { PlatformKey } from "../lib/platform-install";
export {
  PLATFORM_LABELS,
  SKILLS_CLI_AGENTS,
  isSkillsCliCommand,
  skillsCliCommand,
  supportsInstallPlatform,
  getPlatformInstall,
} from "../lib/platform-install";

const STORAGE_KEY = "ts-platform-pref";
const EVENT_NAME = "ts-platform-change";

export function usePlatform() {
  const [platform, setPlatformState] = useState<PlatformKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Deliberate: the first client render must match the server HTML, so the
    // saved platform is only read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PlatformKey | null;
      if (stored) setPlatformState(stored);
    } catch {}
  }, []);

  // Listen for changes emitted by other mounted components on this page
  useEffect(() => {
    function handler(e: Event) {
      setPlatformState((e as CustomEvent<PlatformKey | null>).detail);
    }
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const setPlatform = useCallback((p: PlatformKey | null) => {
    setPlatformState(p);
    try {
      if (p) localStorage.setItem(STORAGE_KEY, p);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: p }));
  }, []);

  return { platform, setPlatform, mounted };
}

