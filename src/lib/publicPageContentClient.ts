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
    let changed = false;
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
        changed = true;
        setContent(resolvePublicPageContent(page, event.detail.data));
      } else if (event instanceof StorageEvent && event.key === storageKey(page)) {
        changed = true;
        refresh();
      }
    };
    void Promise.resolve().then(() => {
      if (cancelled || changed) return;
      refresh();
      setLoading(true);
      setLoadError("");
    });
    citsApi
      .getPublicPageContent(page)
      .then((data: PublicPageContent) => {
        if (cancelled || changed) return;
        setContent(resolvePublicPageContent(page, data));
      })
      .catch(() => {
        if (!cancelled && !changed)
          setLoadError("Konten tersimpan belum dapat dimuat. Muat ulang halaman sebelum mengedit.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    window.addEventListener(eventName, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener(eventName, onUpdate);
      window.removeEventListener("storage", onUpdate);
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
