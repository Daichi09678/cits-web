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
  const inFlight = useRef<Promise<void> | null>(null);
  const reload = useCallback(
    (replace = false) => {
      if (inFlight.current && !replace) return inFlight.current;
      const current = ++revision.current;
      const request = Promise.resolve()
        .then(async () => {
          const data = await citsApi.getTeamMembers(admin);
          if (current !== revision.current) return;
          setMembers(data);
          setError("");
        })
        .catch((cause: unknown) => {
          if (current === revision.current)
            setError(cause instanceof Error ? cause.message : "Data tim belum dapat dimuat.");
        })
        .finally(() => {
          if (current !== revision.current) return;
          inFlight.current = null;
          setLoading(false);
        });
      inFlight.current = request;
      return request;
    },
    [admin]
  );

  const cancelPending = useCallback(() => {
    revision.current++;
    inFlight.current = null;
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) void reload();
    });
    const refresh = () => {
      if (!document.hidden) void reload();
    };
    const refreshAfterEdit = () => {
      if (!document.hidden) void reload(true);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === eventName) refreshAfterEdit();
    };
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener(eventName, refreshAfterEdit);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      cancelPending();
      window.clearInterval(timer);
      window.removeEventListener(eventName, refreshAfterEdit);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [reload, cancelPending]);

  return { members, setMembers, loading, error, reload };
}
