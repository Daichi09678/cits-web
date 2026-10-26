"use client";

import Link from "next/link";
import ProductPhoto from "@/components/ui/ProductPhoto";
import { consultationHref } from "@/lib/consultation";
import { ArrowRight, Shield, CheckCircle2, Activity, ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Counter from "@/components/animations/Counter";
import ParticleNetwork from "@/components/animations/ParticleNetwork";
import FloatingShapes from "@/components/animations/FloatingShapes";
import TypewriterText from "@/components/animations/TypewriterText";
import HeroMockup from "@/components/ui/HeroMockup";
import GridPattern from "@/components/ui/GridPattern";
import GradientText from "@/components/ui/GradientText";
import Marquee from "@/components/ui/Marquee";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useCitsStore } from "@/stores/citsStore";
import { initialLandingPageData, defaultSectionVisibility } from "@/data/initialData";
import FeaturedCatalog from "@/components/ui/FeaturedCatalog";

export default function Home() {
  const {
    landingData,
    clients: storeClients,
    contactInfo,
    services: storeServices,
    activeProducts,
    activeCaseStudies,
  } = useCitsStore();
  const currentLanding = landingData || initialLandingPageData;
  const visibility = { ...defaultSectionVisibility, ...currentLanding.sectionVisibility };
  const hero = { ...initialLandingPageData.hero, ...currentLanding.hero };
  const highlights = currentLanding.highlights || initialLandingPageData.highlights;
  const activeHighlights = highlights.filter((h) => h.isActive !== false);
  const servicesIntro = { ...initialLandingPageData.servicesIntro, ...currentLanding.servicesIntro };
  const productsIntro = { ...initialLandingPageData.productsIntro, ...currentLanding.productsIntro };
  const clientsIntro = { ...initialLandingPageData.clientsIntro, ...currentLanding.clientsIntro };
  const cta = { ...initialLandingPageData.cta, ...currentLanding.cta };

  const marqueeList = storeClients
    .filter((client) => client.isActive !== false && client.showOnHome !== false)
    .map((client) => ({ name: client.name, logo: client.logo, showLabel: true }));
  const featuredProducts = activeProducts.filter((product) => product.showOnHome !== false);
  const featuredServices = storeServices.filter(
    (service) => service.isActive !== false && service.showOnHome !== false
  );

  return (
    <>
      {/* Top Official Announcement Banner */}
      {contactInfo?.announcement?.isActive && contactInfo.announcement.text && (
        <aside
          aria-label="Pengumuman Resmi"
          className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-2.5 px-4 text-xs font-semibold shadow-xs"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              <span>{contactInfo.announcement.text}</span>
            </div>
            {contactInfo.announcement.linkText && contactInfo.announcement.linkUrl && (
              <a
                href={contactInfo.announcement.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto sm:mx-0 inline-flex items-center gap-1 underline hover:text-orange-100 font-bold text-[11px]"
              >
                <span>{contactInfo.announcement.linkText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </aside>
      )}

      {/* Hero Section */}
      {visibility.hero !== false && (
        <section className="relative overflow-hidden bg-white dark:bg-[#1A1A2E] min-h-[92vh] flex items-center transition-colors">
          <ParticleNetwork />
          <FloatingShapes />
          <GridPattern />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Headline */}
              <div className={hero.showMockup !== false ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl"}>
                <ScrollReveal>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-300 text-sm font-semibold mb-6 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                    <span>{hero.badgeText ?? "Penyedia Solusi Teknologi Informasi Sejak 2006"}</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark dark:text-white tracking-tight leading-[1.15]">
                    {hero.headlinePrefix ?? "Ciptakan Solusi"}
                    <br />
                    {hero.typewriterWords.length > 0 && <TypewriterText words={hero.typewriterWords} />}
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-white/90 leading-relaxed max-w-xl">
                    {hero.subheadline}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="mt-8 flex flex-wrap gap-4 items-center">
                    <Link
                      href={hero.primaryCtaLink ?? "/contact"}
                      className="group px-7 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/35 flex items-center gap-2.5 text-sm"
                    >
                      {hero.primaryCtaText ?? "Konsultasi Sekarang"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={hero.secondaryCtaLink ?? "/products"}
                      className="px-7 py-3.5 border-2 border-gray-200 dark:border-white/20 hover:border-orange-600 dark:hover:border-orange-400 text-gray-700 dark:text-white hover:text-orange-700 dark:hover:text-orange-400 font-semibold rounded-xl transition-all bg-white/70 dark:bg-white/10 backdrop-blur-sm text-sm shadow-sm"
                    >
                      {hero.secondaryCtaText ?? "Eksplorasi Produk"}
                    </Link>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                  <div className="mt-10 pt-6 border-t border-gray-200/60 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-600 dark:text-white/80">
                    {hero.trustBadges &&
                      hero.trustBadges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{badge}</span>
                        </div>
                      ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Interactive Mockup */}
              {hero.showMockup !== false && (
                <div className="lg:col-span-5">
                  <ScrollReveal direction="right" delay={0.2}>
                    <HeroMockup title={hero.mockupTitle} status={hero.mockupStatus} projects={activeCaseStudies} />
                  </ScrollReveal>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stats Counter Section - Foto 1 & 3: #1A1A2E Navy in Dark Mode with White Text */}
      {visibility.highlights !== false && activeHighlights.length > 0 && (
        <section className="relative py-20 bg-slate-50 dark:bg-[#151528] border-y border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
          <ParticleNetwork className="opacity-45" />
          <FloatingShapes />
          <GridPattern className="opacity-60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid grid-cols-2 ${["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"][Math.min(activeHighlights.length, 4) - 1]} gap-8 text-center`}
            >
              {activeHighlights.map((item) => (
                <div key={item.label} className="p-3">
                  <Counter
                    value={item.value}
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-600 dark:text-orange-400 tracking-tight"
                  />
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interactive featured services and products */}
      {visibility.services !== false && featuredServices.length > 0 && (
        <FeaturedCatalog
          services={featuredServices}
          products={[]}
          badge={servicesIntro.badge}
          bottomCtaText={servicesIntro.bottomCtaText}
          bottomCtaLink={servicesIntro.bottomCtaLink}
          title={servicesIntro.title}
          subtitle={servicesIntro.subtitle}
        />
      )}

      {/* Featured Products Bento Grid Section (unchanged product presentation) */}
      {visibility.products !== false && featuredProducts.length > 0 && (
        <section className="relative overflow-hidden bg-slate-50/70 py-24 transition-colors dark:bg-[#151528]/80">
          <ParticleNetwork className="opacity-35" />
          <FloatingShapes />
          <GridPattern className="opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-orange-800 dark:border-orange-800/50 dark:bg-orange-950/40 dark:text-orange-300">
                  <Shield className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  <span>{productsIntro?.badge ?? "Solusi Skala Nasional"}</span>
                </div>
                <h2 className="text-3xl font-bold text-dark dark:text-white md:text-4xl lg:text-5xl">
                  {productsIntro?.title !== undefined ? (
                    productsIntro.title
                  ) : (
                    <>
                      Produk <GradientText>Unggulan CITS</GradientText>
                    </>
                  )}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-white/85 md:text-base">
                  {productsIntro?.subtitle ??
                    "Platform kesistemanan yang telah teruji melayani jutaan transaksi data di berbagai kementerian dan institusi nasional."}
                </p>
              </div>
            </ScrollReveal>

            <div
              className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
              data-testid="featured-products"
            >
              {featuredProducts.map((product, index) => (
                <ScrollReveal
                  key={product.id}
                  delay={index * 0.08}
                  className={`h-full ${index === 0 ? "md:col-span-2" : ""}`}
                >
                  <SpotlightCard className="h-full">
                    <article className="flex h-full flex-col" data-product-id={product.id}>
                      <Link
                        href={`/products#${encodeURIComponent(product.id)}`}
                        aria-label={`Lihat produk ${product.name}`}
                        className="block overflow-hidden bg-slate-100 dark:bg-white/5"
                      >
                        <ProductPhoto
                          image={product.image}
                          name={product.name}
                          className="h-52 transition-transform duration-300 hover:scale-105 sm:h-64"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <span className="text-xs font-semibold text-orange-800 dark:text-orange-300">
                          {product.category}
                        </span>
                        <h3 className="mt-2 text-xl font-bold text-dark dark:text-white sm:text-2xl">{product.name}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-white/85">
                          {product.description}
                        </p>
                        <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-white/85">
                          {product.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-700 dark:text-orange-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex flex-wrap gap-3 pt-6">
                          <Link
                            href={`/products#${encodeURIComponent(product.id)}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-800 hover:underline dark:text-orange-300"
                          >
                            Lihat Detail Produk <ArrowUpRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={consultationHref({ productId: product.id, source: "home" })}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800"
                          >
                            Konsultasikan Produk <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.35}>
              <div className="mt-14 text-center">
                <Link
                  href={productsIntro.bottomCtaLink ?? "/products"}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-all hover:-translate-y-0.5 hover:from-orange-700 hover:to-orange-800"
                >
                  <span>{productsIntro.bottomCtaText ?? "Lihat Semua Produk"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
      {/* Client Logos Marquee */}
      {visibility.clients !== false && marqueeList.length > 0 && (
        <section className="py-16 bg-white dark:bg-[#1A1A2E] border-t border-gray-100 dark:border-white/10 relative overflow-hidden transition-colors">
          <GridPattern className="opacity-40" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="text-center text-xs md:text-sm text-gray-700 dark:text-white/90 uppercase tracking-widest mb-8 font-semibold">
                {clientsIntro?.title ?? "Dipercaya oleh Kementerian, BUMN, dan Lembaga Nasional"}
              </p>
            </ScrollReveal>
            <Marquee items={marqueeList} speed={45} />
          </div>
        </section>
      )}

      {/* CTA Section - Foto 5: #151528 Dark Navy with White Text & Orange Buttons */}
      {visibility.cta !== false && (
        <section className="relative py-24 bg-slate-50 dark:bg-[#151528] border-t border-gray-200/70 dark:border-white/10 overflow-hidden transition-colors">
          <ParticleNetwork className="opacity-45" />
          <FloatingShapes />
          <GridPattern className="opacity-60" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200/70 dark:border-orange-800/50 text-xs font-semibold mb-6 shadow-sm">
                <Activity className="w-3.5 h-3.5 text-orange-700 dark:text-orange-400" />
                <span>{cta.badge ?? "Mitra Transformasi Digital Terpercaya"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark dark:text-white tracking-tight leading-tight">
                {cta.title ?? "Siap Mengakselerasi Sistem Informasi Perusahaan Anda?"}
              </h2>
              <p className="mt-5 text-gray-700 dark:text-white/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {cta.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={cta.primaryLink ?? "/contact"}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/35 text-sm"
                >
                  {cta.primaryText ?? "Mulai Konsultasi Gratis"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={cta.secondaryLink ?? "/about"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-gray-800 dark:text-white font-bold rounded-xl transition-all border border-gray-200 dark:border-white/20 text-sm shadow-sm"
                >
                  {cta.secondaryText ?? "Pelajari Profil Perusahaan"}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </>
  );
}
