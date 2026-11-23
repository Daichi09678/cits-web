"use client";

import { useEffect, useRef, useState } from "react";
import { citsApi } from "@/lib/api";
import { resolvePublicPageContent, type PublicContentPage, type PublicPageContent } from "@/lib/publicPageContent";

const eventName = "cits-page-content-updated";
const storageKey = (page: PublicContentPage) => `cits_public_page_${page}`;

export function usePublicPageContent(page: PublicContentPage) {
  const [content, setContent] = useState(() => resolvePublicPageContent(page));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const reloadRef = useRef<(() => Promise<boolean>) | null>(null);
  useEffect(() => {
    let cancelled = false;
    let revision = 0;
    let inFlight: Promise<boolean> | null = null;
    const refresh = () => {
      try {
        const cached = localStorage.getItem(storageKey(page));
        if (cached) setContent(resolvePublicPageContent(page, JSON.parse(cached)));
      } catch {
        /* Keep the last valid content if browser storage is unavailable. */
      }
    };
    const onUpdate = (event: Event) => {
      if (event instanceof CustomEvent) {
        if (event.detail?.page !== page) return;
        revision++;
        setContent(resolvePublicPageContent(page, event.detail.data));
      } else if (event instanceof StorageEvent && event.key === storageKey(page)) {
        revision++;
        refresh();
      }
    };
    void Promise.resolve().then(() => {
      if (cancelled || revision) return;
      refresh();
      setLoading(true);
      setLoadError("");
    });
    const reload = (interactive = false): Promise<boolean> => {
      if (cancelled || document.hidden) return Promise.resolve(false);
      if (interactive) setLoading(true);
      if (inFlight) return inFlight;
      const current = revision;
      inFlight = Promise.resolve()
        .then(() => citsApi.getPublicPageContent(page))
        .then((data) => {
          if (cancelled || current !== revision) return false;
          setContent(resolvePublicPageContent(page, data));
          setLoadError("");
          try {
            localStorage.setItem(storageKey(page), JSON.stringify(data));
          } catch {
            // Browser storage can fail after the data has already loaded.
          }
          return true;
        })
        .catch(() => {
          if (!cancelled && current === revision) setLoadError("Konten tersimpan belum dapat dimuat.");
          return false;
        })
        .finally(() => {
          inFlight = null;
          if (!cancelled) setLoading(false);
        });
      return inFlight;
    };
    reloadRef.current = () => reload(true);
    const onFocus = () => void reload();
    void reload();
    const timer = window.setInterval(onFocus, 10000);
    window.addEventListener(eventName, onUpdate);
    window.addEventListener("storage", onUpdate);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      cancelled = true;
      reloadRef.current = null;
      window.clearInterval(timer);
      window.removeEventListener(eventName, onUpdate);
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [page]);

  const save = async (next: PublicPageContent) => {
    const saved = await citsApi.updatePublicPageContent(page, next);
    setContent(resolvePublicPageContent(page, saved));
    try {
      localStorage.setItem(storageKey(page), JSON.stringify(saved));
    } catch {
      /* Server save is already confirmed. */
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail: { page, data: saved } }));
  };
  const retryLoad = () => reloadRef.current?.() ?? Promise.resolve(false);

  return { content, loading, loadError, save, retryLoad };
}
