"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Wifi, Zap, Activity, Signal, Globe } from "lucide-react";

interface NetworkProfile {
  type: string;
  speedCategory: "fast" | "medium" | "slow";
  label: string;
  estimatedDuration: number; // in milliseconds
  stepInterval: number;
  downlink?: number;
  rtt?: number;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard Ringkasan",
  "/admin/landing": "Editor Landing Page",
  "/admin/products": "Katalog Produk Kami",
  "/admin/about": "Tentang CITS Indonesia",
  "/admin/contact": "Kotak Masuk Hubungi Kami",
  "/admin/services": "Layanan & Pilar Solusi",
  "/admin/clients": "Mitra Institusi & Klien",
  "/admin/settings": "Pengaturan Sistem",
  "/admin/login": "Autentikasi Masuk",
};

export default function AdminPageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetTitle, setTargetTitle] = useState("");
  const [networkInfo, setNetworkInfo] = useState<NetworkProfile>({
    type: "4g",
    speedCategory: "fast",
    label: "Koneksi Cepat (4G/Fiber)",
    estimatedDuration: 300,
    stepInterval: 40,
  });

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef(pathname);

  // 1. Detect Network Profile from Browser's Network Information API
  const detectNetwork = useCallback((): NetworkProfile => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        type: "4g",
        speedCategory: "fast",
        label: "Koneksi Stabil",
        estimatedDuration: 350,
        stepInterval: 45,
      };
    }

    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) {
      return {
        type: "online",
        speedCategory: "fast",
        label: "Koneksi Stabil",
        estimatedDuration: 350,
        stepInterval: 45,
      };
    }

    const effectiveType = connection.effectiveType || "4g";
    const downlink = connection.downlink || 10; // in Mbps
    const rtt = connection.rtt || 50; // in ms

    // Slow 2G / Poor Connection
    if (effectiveType === "slow-2g" || effectiveType === "2g" || (rtt > 400 && downlink < 1.0)) {
      return {
        type: effectiveType,
        speedCategory: "slow",
        label: `Jaringan Lambat (${effectiveType.toUpperCase()}) • Mengoptimalkan data`,
        estimatedDuration: 1400,
        stepInterval: 120,
        downlink,
        rtt,
      };
    }

    // 3G / Medium Speed
    if (effectiveType === "3g" || downlink < 3.0 || rtt > 200) {
      return {
        type: "3g",
        speedCategory: "medium",
        label: `Koneksi Stabil (3G/4G) • ${downlink ? `${downlink} Mbps` : ""}`,
        estimatedDuration: 650,
        stepInterval: 70,
        downlink,
        rtt,
      };
    }

    // Fast 4G / High Speed Fiber
    return {
      type: "4g",
      speedCategory: "fast",
      label: `Koneksi Cepat (4G+) • ${rtt ? `RTT ${rtt}ms` : "Optimal"}`,
      estimatedDuration: 320,
      stepInterval: 35,
      downlink,
      rtt,
    };
  }, []);

  // Initialize and listen to network connection changes
  useEffect(() => {
    const net = detectNetwork();
    setNetworkInfo(net);

    const connection =
      typeof navigator !== "undefined" &&
      ((navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection);

    if (connection && connection.addEventListener) {
      const handleNetChange = () => {
        setNetworkInfo(detectNetwork());
      };
      connection.addEventListener("change", handleNetChange);
      return () => {
        connection.removeEventListener("change", handleNetChange);
      };
    }
  }, [detectNetwork]);

  // Clean intervals
  const clearIntervals = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  }, []);

  // Complete Navigation Loading
  const completeLoading = useCallback(() => {
    clearIntervals();
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 240);
  }, [clearIntervals]);

  // Start Navigation Loading with Network-adjusted pacing
  const startLoading = useCallback(
    (targetHref: string) => {
      clearIntervals();
      const net = detectNetwork();
      setNetworkInfo(net);

      // Determine human readable title
      const cleanHref = targetHref.split("?")[0].replace(/\/$/, "");
      const foundTitle = PAGE_TITLES[cleanHref] || PAGE_TITLES[targetHref] || "Halaman Admin";
      setTargetTitle(foundTitle);

      setIsLoading(true);
      setProgress(15);

      // Step progressive increment based on network speed
      let current = 15;
      progressIntervalRef.current = setInterval(() => {
        // Asymptotically approach 88% while waiting for page hydration
        if (current < 50) {
          current += net.speedCategory === "fast" ? 18 : net.speedCategory === "medium" ? 10 : 5;
        } else if (current < 85) {
          current += net.speedCategory === "fast" ? 8 : net.speedCategory === "medium" ? 5 : 2;
        } else if (current < 92) {
          current += 1;
        }
        setProgress(Math.min(current, 92));
      }, net.stepInterval);

      // Safety timeout: prevent getting stuck forever
      safetyTimeoutRef.current = setTimeout(() => {
        completeLoading();
      }, 7000);
    },
    [detectNetwork, clearIntervals, completeLoading]
  );

  // When pathname changes, complete loading smoothly
  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname;
      if (isLoading) {
        completeLoading();
      }
    }
  }, [pathname, isLoading, completeLoading]);

  // Intercept all internal admin link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find nearest link element
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, anchors, modifier keys, or new tab clicks
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it is an internal admin navigation
      if (href.startsWith("/admin")) {
        const cleanCurrent = pathname.split("?")[0];
        const cleanTarget = href.split("?")[0];

        // Only trigger loading if navigating to a different page
        if (cleanCurrent !== cleanTarget) {
          startLoading(href);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      clearIntervals();
    };
  }, [pathname, startLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* 1. TOP PROGRESS BAR (Gradient with Glow & Shimmer) */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[99999] pointer-events-none overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_0_12px_rgba(249,115,22,0.9)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "180ms" : `${networkInfo.stepInterval * 1.5}ms`,
          }}
        />
      </div>

      {/* 2. CENTER TRANSITION SCREEN (Glassmorphism Modal with Network Indicator) */}
      <div
        className={`fixed inset-0 z-[99998] pointer-events-none flex items-center justify-center transition-opacity duration-200 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Subtle backdrop blur */}
        <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/25 backdrop-blur-[2px]" />

        {/* Central Floating Status Card */}
        <div className="relative px-6 py-5 rounded-3xl bg-white/95 dark:bg-[#151528]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-orange-600/10 flex flex-col items-center gap-3.5 max-w-xs w-full mx-4 text-center animate-in zoom-in-95 duration-150">
          {/* Animated Dual-Ring Spinner */}
          <div className="relative w-11 h-11 flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 dark:border-orange-400/20 animate-ping opacity-40" />
            {/* Spinning Gradient Ring */}
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 border-t-orange-600 dark:border-t-orange-400 border-r-orange-500 animate-spin" />
            {/* Center Dot */}
            <div className="absolute w-3 h-3 rounded-full bg-orange-600 dark:bg-orange-500 shadow-sm shadow-orange-600/50" />
          </div>

          {/* Page & Action Title */}
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight">
              Memuat {targetTitle || "Halaman Admin"}...
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Menyiapkan antarmuka Back Office CITS
            </p>
          </div>

          {/* Mini Linear Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Adaptive Network Quality Indicator Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            {networkInfo.speedCategory === "fast" ? (
              <Zap className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : networkInfo.speedCategory === "medium" ? (
              <Signal className="w-3 h-3 text-amber-500 shrink-0" />
            ) : (
              <Wifi className="w-3 h-3 text-rose-500 shrink-0 animate-pulse" />
            )}
            <span className="truncate">{networkInfo.label}</span>
          </div>
        </div>
      </div>
    </>
  );
}
