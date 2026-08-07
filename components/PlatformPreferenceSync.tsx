"use client";

import { useEffect } from "react";
import { PlatformKey } from "../lib/platforms";
import { usePlatform } from "../hooks/usePlatform";

export function PlatformPreferenceSync({ platform }: { platform: PlatformKey }) {
  const { setPlatform } = usePlatform();

  useEffect(() => {
    setPlatform(platform);
  }, [platform, setPlatform]);

  return null;
}

