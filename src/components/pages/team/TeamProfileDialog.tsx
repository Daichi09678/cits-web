"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { CalendarDays, ShieldCheck, Users, X } from "lucide-react";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import Button from "@/components/ui/Button";
import type { TeamMember } from "@/lib/team";

const detailLabel = "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400";
const profileSectionLabel = "text-xs font-bold uppercase tracking-wide text-slate-950 dark:text-slate-100";

export default function TeamProfileDialog({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const description = member.description?.trim() || "";
  const teamName = member.teamName?.trim() || "";
  const initials = member.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toLocaleUpperCase("id");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const stops = event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex="0"]'
        );
        const first = stops[0];
        const last = stops[stops.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[min(680px,calc(100vw-24px))] max-w-none flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 open:flex dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white"
    >
      <div aria-hidden="true" className={`h-0.5 shrink-0 ${accentStyles.fill}`} />
      <header className="flex shrink-0 justify-end border-b border-slate-200 px-4 py-1 dark:border-white/10">
        <Button
          variant="unstyled"
          size="none"
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail profil"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-slate-300 dark:hover:bg-white/5"
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      </header>
      <div
        role="region"
        aria-label="Isi profil anggota"
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-600"
      >
        <div className="grid sm:grid-cols-[minmax(0,41.5%)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4 border-b border-slate-200 bg-[#fcf8f4] p-4 sm:border-r sm:border-b-0 sm:p-6 dark:border-white/10 dark:bg-orange-500/[0.04]">
            <div className="relative flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-200 bg-[#ffecd5] text-4xl font-bold text-orange-800 sm:size-44 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 176px, 144px"
                  className="object-cover object-top"
                />
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>
            <div className="mt-auto min-w-0">
              <h2 id={titleId} className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-orange-800 dark:text-orange-300">{member.position}</p>
              <p className="mt-3 flex w-fit max-w-full items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Users aria-hidden="true" className={`size-3.5 shrink-0 ${accentStyles.accent}`} />
                <span className="min-w-0">Tim: {teamName || "Belum ditentukan"}</span>
              </p>
            </div>
            {(member.serviceFocus || member.availability) && (
              <dl className="space-y-3 border-t border-orange-200/70 pt-4 text-xs text-slate-700 dark:border-orange-500/20 dark:text-slate-200">
                {member.serviceFocus && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck aria-hidden="true" className={`size-4 shrink-0 ${accentStyles.accent}`} />
                    <div className="min-w-0">
                      <dt className={detailLabel}>Fokus layanan</dt>
                      <dd>{member.serviceFocus}</dd>
                    </div>
                  </div>
                )}
                {member.availability && (
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      aria-hidden="true"
                      className="size-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                    />
                    <div className="min-w-0">
                      <dt className={detailLabel}>Ketersediaan</dt>
                      <dd>{member.availability}</dd>
                    </div>
                  </div>
                )}
              </dl>
            )}
          </div>
          <div className="min-w-0 space-y-5 p-4 sm:p-6">
            <section aria-labelledby={`${titleId}-about`}>
              <h3 id={`${titleId}-about`} className="flex items-center gap-2.5 text-sm font-bold">
                <span aria-hidden="true" className={`h-[18px] w-1 shrink-0 rounded-full ${accentStyles.fill}`} />
                <span className="min-w-0">Tentang {member.name}</span>
              </h3>
              <p
                id={descriptionId}
                className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                {description || "Deskripsi anggota ini belum tersedia."}
              </p>
            </section>
            {!!member.expertise?.length && (
              <section aria-labelledby={`${titleId}-expertise`}>
                <h3 id={`${titleId}-expertise`} className={profileSectionLabel}>
                  Bidang keahlian
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {member.expertise.map((skill) => (
                    <li
                      key={skill}
                      className="max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-950 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!!member.projectRoles?.length && (
              <section aria-labelledby={`${titleId}-project-roles`}>
                <h3 id={`${titleId}-project-roles`} className={profileSectionLabel}>
                  Peran dalam proyek
                </h3>
                <ul className="mt-2 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-slate-950 dark:text-slate-100">
                  {member.projectRoles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Direktori tim CITS Indonesia</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="unstyled"
            size="none"
            type="button"
            onClick={onClose}
            className={`min-h-10 rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${accentStyles.action}`}
          >
            Tutup
          </Button>
        </div>
      </footer>
    </dialog>
  );
}
