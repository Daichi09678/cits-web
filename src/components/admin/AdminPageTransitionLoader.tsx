"use client";

import { useLinkStatus } from "next/link";

export default function AdminPageTransitionLoader() {
  const { pending } = useLinkStatus();
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center" role={pending ? "status" : undefined}>
      {pending && (
        <>
          <span
            aria-hidden="true"
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          />
          <span className="sr-only">Memuat halaman...</span>
        </>
      )}
    </span>
  );
}
