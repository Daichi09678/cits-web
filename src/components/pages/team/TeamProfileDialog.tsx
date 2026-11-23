"use client";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";
import Button from "@/components/ui/Button";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { FileText, UserRound, Users, X } from "lucide-react";
import type { TeamMember } from "@/lib/team";

export default function TeamProfileDialog({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const description = member.description?.trim() || "";
  const teamName = member.teamName?.trim() || "";

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
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
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
      className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[min(700px,calc(100vw-32px))] max-w-none flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 open:flex dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white"
    >
      <div aria-hidden="true" className={`h-1 shrink-0 ${accentStyles.fill}`} />
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-3 dark:border-white/10">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <UserRound aria-hidden="true" className={`size-4 shrink-0 ${accentStyles.accent}`} />
          {member.isDemo ? "Profil ilustrasi" : "Profil anggota tim"}
        </p>
        <Button
          variant="unstyled"
          size="none"
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail profil"
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-slate-300 dark:hover:bg-white/5"
        >
          <X aria-hidden="true" className="size-5" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-wrap:anywhere]">
        <div className="grid sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-4 border-b border-slate-200 bg-orange-50/40 text-left sm:border-r sm:border-b-0 dark:border-white/10 dark:bg-orange-500/[0.04]">
            <div className={`relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden bg-[#FFF0E5] sm:aspect-square dark:bg-orange-500/10 ${accentStyles.accent}`}>
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={`Foto ${member.name}`}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 260px, calc(100vw - 34px)"
                  className="object-cover object-top"
                />
              ) : (
                <UserRound aria-hidden="true" className="size-20" strokeWidth={1.5} />
              )}
            </div>
            <div className="min-w-0 px-5">
              <h2
                id={titleId}
                className="text-xl font-bold leading-snug tracking-tight text-[#0F172A] sm:text-2xl dark:text-white"
              >
                {member.name}
              </h2>
              <p className={`mt-2 text-base font-semibold leading-relaxed ${accentStyles.text}`}>
                {member.position}
              </p>
            </div>
            <p className="mx-5 mb-5 flex max-w-full items-start gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-left text-sm font-medium leading-snug text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Users aria-hidden="true" className={`mt-0.5 size-4 shrink-0 ${accentStyles.accent}`} />
              <span className="min-w-0 break-words">Tim: {teamName || "Belum ditentukan"}</span>
            </p>
          </div>
          <div className="px-6 py-6">
            <section aria-labelledby={`${titleId}-about`}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-4 w-1 shrink-0 rounded-full ${accentStyles.fill}`} />
                <h3 id={`${titleId}-about`} className="min-w-0 text-lg font-bold text-[#0F172A] dark:text-white">
                  Tentang {member.name}
                </h3>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                {description ? (
                  <p
                    id={descriptionId}
                    className="whitespace-pre-line text-base leading-7 text-slate-700 dark:text-slate-200"
                  >
                    {description}
                  </p>
                ) : (
                  <div id={descriptionId} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10">
                      <FileText aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm italic leading-7 text-slate-500 dark:text-slate-400">
                        Deskripsi anggota ini belum tersedia.
                      </p>
                      <Link
                        href="/contact"
                        className={`mt-1 inline-flex text-sm font-semibold underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${accentStyles.text}`}
                      >
                        Hubungi tim CITS
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Direktori tim CITS Indonesia
        </p>
        <Button
          variant="unstyled"
          size="none"
          type="button"
          onClick={onClose}
          className={`min-h-11 rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${accentStyles.action}`}
        >
          Tutup
        </Button>
      </footer>
    </dialog>
  );
}
