"use client";

import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  textClassName?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "AD";
  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

export default function UserAvatar({
  src,
  name,
  size = 40,
  className = "",
  textClassName = "text-xs",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const validSource = !!src && (src.startsWith("data:image/") || src.startsWith("/"));

  if (validSource && !failed) {
    return (
      <Image
        src={src}
        alt={`Foto profil ${name}`}
        width={size}
        height={size}
        unoptimized
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-label={`Avatar ${name}`}
      style={{ width: size, height: size }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 font-bold text-white shadow-sm ${textClassName} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
