"use client";

import { useEffect, useState } from "react";
import { citsApi } from "@/lib/api";
import { resolvePublicPageContent, type PublicContentPage, type PublicPageContent } from "@/lib/publicPageContent";

const eventName = "cits-page-content-updated";
const storageKey = (page: PublicContentPage) => `cits_public_page_${page}`;

export function usePublicPageContent(page: PublicContentPage) {
  const [content, setContent] = useState(() => resolvePublicPageContent(page));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let cancelled = false;
    let revision = 0;
    let inFlight = false;
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
    const reload = async () => {
      if (cancelled || inFlight || document.hidden) return;
      inFlight = true;
      const current = revision;
      try {
        const data = await citsApi.getPublicPageContent(page);
        if (cancelled || current !== revision) return;
        setContent(resolvePublicPageContent(page, data));
        setLoadError("");
        try {
          localStorage.setItem(storageKey(page), JSON.stringify(data));
        } catch {
          // A successful read must still update the page when browser storage is full.
        }
      } catch {
        if (!cancelled && current === revision)
          setLoadError("Konten tersimpan belum dapat dimuat. Muat ulang halaman sebelum mengedit.");
      } finally {
        inFlight = false;
        if (!cancelled) setLoading(false);
      }
    };
    const onFocus = () => void reload();
    void reload();
    const timer = window.setInterval(onFocus, 10000);
    window.addEventListener(eventName, onUpdate);
    window.addEventListener("storage", onUpdate);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      cancelled = true;
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
  return { content, loading, loadError, save };
}
