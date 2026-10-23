"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductPhoto({
  image,
  name,
  className = "",
}: {
  image?: string;
  name: string;
  className?: string;
}) {
  const [failedImage, setFailedImage] = useState<string>();
  const useProductImage = Boolean(image && image !== failedImage);
  return (
    <Image
      key={image}
      src={useProductImage ? image! : "/services/software-house.webp"}
      alt={useProductImage ? name : `Ilustrasi solusi perangkat lunak ${name}`}
      width={800}
      height={500}
      unoptimized
      onError={() => setFailedImage(image)}
      className={`w-full object-cover ${className}`}
    />
  );
}
