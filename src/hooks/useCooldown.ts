"use client";

import { useCallback, useEffect, useState } from "react";

export function useCooldown(storageKey: string, durationSeconds = 60) {
  const [remaining, setRemaining] = useState<number>(0);

  const syncRemaining = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return 0;
    const expiresAt = parseInt(raw, 10);
    const diff = Math.ceil((expiresAt - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }, [storageKey]);

  useEffect(() => {
    setRemaining(syncRemaining());
    const interval = window.setInterval(() => {
      setRemaining(syncRemaining());
    }, 1000);
    return () => window.clearInterval(interval);
  }, [syncRemaining]);

  const startCooldown = useCallback(() => {
    if (typeof window === "undefined") return;
    const expiresAt = Date.now() + durationSeconds * 1000;
    window.localStorage.setItem(storageKey, String(expiresAt));
    setRemaining(durationSeconds);
  }, [storageKey, durationSeconds]);

  return {
    remaining,
    isCoolingDown: remaining > 0,
    startCooldown,
  };
}
