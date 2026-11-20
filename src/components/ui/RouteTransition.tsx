"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

export default function RouteTransition(props: HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = content.current?.animate?.([{ opacity: 0.88 }, { opacity: 1 }], {
      duration: 160,
      easing: "ease-out",
    });
    return () => animation?.cancel();
  }, [pathname]);

  const { children, ...attributes } = props;
  return (
    <MotionConfig reducedMotion="user">
      <div ref={content} {...attributes} data-route-content>
        {children}
      </div>
    </MotionConfig>
  );
}
