"use client";

import Image from "next/image";
import { useState } from "react";

export default function ServicePhoto({
  image,
  name,
  className = "",
}: {
  image: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState<string>();
  if (!image || failed === image) {
    return (
      <div className={`flex w-full items-center justify-center bg-slate-100 p-6 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400 ${className}`}>
        Gambar layanan belum tersedia.
      </div>
    );
  }
  return (
    <Image
      key={image}
      src={image}
      alt={`Ilustrasi layanan ${name}`}
      width={800}
      height={500}
      unoptimized
      onError={() => setFailed(image)}
      className={`w-full object-cover object-center ${className}`}
    />
  );
}
