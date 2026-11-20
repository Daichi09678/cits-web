"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface MarqueeItem {
  name: string;
  logo?: string;
  showLabel?: boolean;
}

interface MarqueeProps {
  items: MarqueeItem[];
  speed?: number;
}

function MarqueeLogoImage({ src, alt, showLabel }: { src: string; alt: string; showLabel?: boolean }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loadError, setLoadError] = useState(false);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoadError(false);
    setHasTriedFallback(false);
  }, [src]);

  if (loadError || !currentSrc) {
    return (
      <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/40 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
        <Building2 className="w-5 h-5" />
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={160}
      height={80}
      loading="lazy"
      unoptimized
      onError={() => {
        if (!hasTriedFallback) {
          setHasTriedFallback(true);
          if (currentSrc.endsWith(".webp")) {
            setCurrentSrc(currentSrc.replace(/\.webp$/, ".png"));
          } else if (currentSrc.endsWith(".svg")) {
            setCurrentSrc(currentSrc.replace(/\.svg$/, ".webp"));
          } else if (currentSrc.endsWith(".png")) {
            setCurrentSrc(currentSrc.replace(/\.png$/, ".webp"));
          } else {
            setLoadError(true);
          }
        } else {
          setLoadError(true);
        }
      }}
      className={`object-contain ${showLabel ? "h-10 w-auto max-w-[48px]" : "h-14 w-auto max-w-[160px]"}`}
    />
  );
}

export default function Marquee({ items, speed = 30 }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  // If items list is short, duplicate items to make marquee loop smooth
  const displayItems = items.length > 0 && items.length < 8 ? [...items, ...items] : items;

  return (
    <div>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[#1A1A2E] to-transparent z-10 pointer-events-none motion-reduce:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#1A1A2E] to-transparent z-10 pointer-events-none motion-reduce:hidden" />

        <div className="flex w-max motion-reduce:w-full">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className={`flex gap-8 pr-8 animate-marquee motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-3 motion-reduce:pr-0 motion-reduce:animate-none ${copy ? "motion-reduce:hidden" : ""}`}
              style={{ animationDuration: `${speed}s`, animationPlayState: paused ? "paused" : "running" }}
              aria-hidden={copy === 1}
            >
              {displayItems.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}-${copy}`}
                  aria-hidden={idx >= items.length || undefined}
                  className={`shrink-0 h-20 px-6 rounded-lg bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-center gap-3 hover:border-brand/30 hover:shadow-sm transition-all motion-reduce:max-w-full ${idx >= items.length ? "motion-reduce:hidden" : ""}`}
                >
                  {item.logo ? (
                    <>
                      <MarqueeLogoImage
                        src={item.logo}
                        alt={item.showLabel ? "" : item.name}
                        showLabel={item.showLabel}
                      />
                      {item.showLabel && (
                        <span className="text-xs text-gray-700 dark:text-white font-medium whitespace-nowrap leading-tight motion-reduce:whitespace-normal">
                          {item.name}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-white font-medium whitespace-nowrap motion-reduce:whitespace-normal">
                      {item.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center motion-reduce:hidden">
        <Button variant="link" size="sm" onClick={() => setPaused((value) => !value)}>
          {paused ? "Lanjutkan animasi logo" : "Jeda animasi logo"}
        </Button>
      </div>
    </div>
  );
}
