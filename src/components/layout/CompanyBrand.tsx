"use client";

import Image from "next/image";
import { createContext, useContext, type ReactNode } from "react";
import { resolvePublicPageContent } from "@/lib/publicPageContent";
import { usePublicPageContent } from "@/lib/publicPageContentClient";

const BrandContext = createContext(resolvePublicPageContent("about"));

export function useCompanyContent() {
  return useContext(BrandContext);
}

/** Share one live content subscription between the public header and footer. */
export default function CompanyBrandProvider({ children }: { children: ReactNode }) {
  const { content } = usePublicPageContent("about");
  return <BrandContext.Provider value={content}>{children}</BrandContext.Provider>;
}

export function CompanyLogo({ location }: { location: "navbar" | "footer" }) {
  const { texts } = useCompanyContent();
  const navbar = location === "navbar";
  return (
    <span className={`relative block shrink-0 ${navbar ? "h-10 w-40" : "h-8 w-[130px]"}`}>
      <Image
        key={`light:${texts.about_hero_src_5}`}
        src={texts.about_hero_src_5}
        alt={texts.about_hero_alt_6}
        fill
        sizes={navbar ? "160px" : "130px"}
        unoptimized
        priority={navbar}
        className="block object-contain object-left dark:hidden"
      />
      <Image
        key={`dark:${texts.about_hero_src_7}`}
        src={texts.about_hero_src_7}
        alt={texts.about_hero_alt_8}
        fill
        sizes={navbar ? "160px" : "130px"}
        unoptimized
        priority={navbar}
        className="hidden object-contain object-left dark:block"
      />
    </span>
  );
}
