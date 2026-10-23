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
  return (
    <Image
      key={image}
      src={failed === image ? "/services/software-house.webp" : image}
      alt={`Ilustrasi layanan ${name}`}
      width={800}
      height={500}
      unoptimized
      onError={() => setFailed(image)}
      className={`w-full object-cover object-center ${className}`}
    />
  );
}
