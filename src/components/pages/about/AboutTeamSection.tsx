"use client";

import ManagedTeamDirectory from "@/components/ui/TeamDirectory";

export default function AboutTeamSection() {
  return (
    <section
      id="tim-kami"
      aria-labelledby="about-team-heading"
      className="scroll-mt-24 border-t border-slate-200/80 bg-white py-16 md:py-24 dark:border-white/10 dark:bg-[#1A1A2E]"
    >
      <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="about-team-heading"
          className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white"
        >
          Tim di Balik CITS Indonesia
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Kenali anggota tim, bidang keahlian, dan perannya dalam mendampingi kebutuhan teknologi organisasi Anda. Pilih
          anggota untuk melihat profil lengkapnya.
        </p>
      </div>
      <ManagedTeamDirectory />
    </section>
  );
}
