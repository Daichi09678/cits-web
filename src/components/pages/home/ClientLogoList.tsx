"use client";

import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import styles from "./ClientLogoList.module.css";

interface ClientLogo {
  name: string;
  logo?: string;
  showLabel?: boolean;
}

function ClientLogoImage({ src, name, showLabel }: { src: string; name: string; showLabel?: boolean }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loadError, setLoadError] = useState(false);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  if (loadError || !currentSrc) {
    return (
      <>
        <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800/40 dark:bg-orange-950/40 ${accentStyles.accent}`}>
          <Building2 className="size-5" />
        </span>
        {!showLabel && <span className="min-w-0 break-words text-xs font-medium">{name}</span>}
      </>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={showLabel ? "" : name}
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
      className={`w-auto object-contain ${showLabel ? "h-10 max-w-[48px] shrink-0" : "h-14 max-w-[min(160px,100%)]"}`}
    />
  );
}

export default function ClientLogoList({ items }: { items: ClientLogo[] }) {
  const shouldLoop = items.length > 1;

  return (
    <div
      className={`relative mx-auto max-w-6xl rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${styles.viewport}`}
      role="region"
      aria-label="Daftar mitra dan klien"
      tabIndex={shouldLoop ? 0 : undefined}
    >
      <div className={shouldLoop ? styles.track : undefined}>
        {Array.from({ length: shouldLoop ? 2 : 1 }, (_, copy) => (
          <ul
            key={copy}
            role="list"
            aria-hidden={copy === 1 || undefined}
            className={copy === 1 ? `${styles.row} ${styles.copy}` : styles.row}
          >
            {items.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="flex min-h-20 max-w-[17rem] shrink-0 items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 sm:px-6 dark:border-white/10 dark:bg-[#16162c] dark:text-white"
              >
                {item.logo && (
                  <ClientLogoImage key={item.logo} src={item.logo} name={item.name} showLabel={item.showLabel} />
                )}
                {(!item.logo || item.showLabel) && (
                  <span className="min-w-0 break-words text-xs font-medium leading-tight">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
