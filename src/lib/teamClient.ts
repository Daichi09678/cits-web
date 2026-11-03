"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { citsApi } from "@/lib/api";
import type { TeamMember } from "@/lib/team";

const eventName = "cits-team-updated";

export function announceTeamUpdate() {
  window.dispatchEvent(new Event(eventName));
  try {
    localStorage.setItem(eventName, String(Date.now()));
  } catch {
    // Other devices refresh directly from the server while this tab stays usable without storage.
  }
}

export function useTeamMembers(admin = false) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const revision = useRef(0);
  const reload = useCallback(async () => {
    const current = ++revision.current;
    try {
      const data = await citsApi.getTeamMembers(admin);
      if (current !== revision.current) return;
      setMembers(data);
      setError("");
    } catch (cause) {
      if (current === revision.current)
        setError(cause instanceof Error ? cause.message : "Data tim belum dapat dimuat.");
    } finally {
      if (current === revision.current) setLoading(false);
    }
  }, [admin]);

  const cancelPending = useCallback(() => {
    revision.current++;
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) void reload();
    });
    const refresh = () => {
      if (!document.hidden) void reload();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === eventName) refresh();
    };
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener(eventName, refresh);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      cancelPending();
      window.clearInterval(timer);
      window.removeEventListener(eventName, refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [reload, cancelPending]);

  return { members, setMembers, loading, error, reload };
}
