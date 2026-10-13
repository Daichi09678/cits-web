"use client";

import Image from "next/image";

interface MarqueeItem {
  name: string;
  logo?: string;
  showLabel?: boolean;
}

interface MarqueeProps {
  items: MarqueeItem[];
  speed?: number;
}

export default function Marquee({ items, speed = 30 }: MarqueeProps) {
  return (
    <div className="overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[#1A1A2E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#1A1A2E] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex gap-8 pr-8 animate-marquee"
            style={{ animationDuration: `${speed}s` }}
            aria-hidden={copy === 1}
          >
            {items.map((item) => (
              <div
                key={`${item.name}-${copy}`}
                className="shrink-0 h-20 px-6 rounded-lg bg-white dark:bg-[#16162c] border border-gray-200 dark:border-white/10 flex items-center gap-3 hover:border-brand/30 hover:shadow-sm transition-all"
              >
                {item.logo ? (
                  <>
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={160}
                      height={80}
                      className={`object-contain ${
                        item.showLabel ? "h-10 w-auto max-w-[48px]" : "h-14 w-auto max-w-[160px]"
                      }`}
                    />
                    {item.showLabel && (
                      <span className="text-xs text-gray-700 dark:text-white font-medium whitespace-nowrap leading-tight">
                        {item.name}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-700 dark:text-white font-medium whitespace-nowrap">{item.name}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
