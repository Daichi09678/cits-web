"use client";

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
      <div aria-hidden="true" className="h-1 shrink-0 bg-gradient-to-r from-orange-600 via-[#F4511E] to-amber-400" />
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-3 dark:border-white/10">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <UserRound aria-hidden="true" className="size-4 shrink-0 text-orange-600 dark:text-orange-400" />
          Profil anggota tim
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail profil"
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-slate-300 dark:hover:bg-white/5"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-wrap:anywhere]">
        <div className="grid sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3.5 border-b border-slate-200 bg-gradient-to-b from-orange-50 via-orange-50/70 to-orange-50/30 px-5 py-6 text-center sm:items-start sm:border-r sm:border-b-0 sm:text-left dark:border-white/10 dark:from-orange-500/10 dark:via-orange-500/[0.05] dark:to-transparent">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FFF0E5] text-orange-600 ring-1 ring-orange-200/80 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-400/20">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={`Foto ${member.name}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover object-top"
                />
              ) : (
                <UserRound aria-hidden="true" className="size-10" strokeWidth={1.5} />
              )}
            </div>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg font-bold leading-snug tracking-tight text-[#0F172A] sm:text-xl dark:text-white"
              >
                {member.name}
              </h2>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-orange-700 dark:text-orange-400">
                {member.position}
              </p>
            </div>
            <p className="flex max-w-full items-start gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-2 text-left text-xs font-medium leading-snug text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Users aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-orange-600 dark:text-orange-400" />
              <span className="min-w-0 break-words">Tim: {teamName || "Belum ditentukan"}</span>
            </p>
          </div>
          <div className="px-6 py-6">
            <section aria-labelledby={`${titleId}-about`}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-4 w-1 shrink-0 rounded-full bg-orange-600 dark:bg-orange-400" />
                <h3 id={`${titleId}-about`} className="min-w-0 text-base font-bold text-[#0F172A] dark:text-white">
                  Tentang {member.name}
                </h3>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                {description ? (
                  <p
                    id={descriptionId}
                    className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200"
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
                        className="mt-1 inline-flex text-sm font-semibold text-orange-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-orange-400"
                      >
                        Hubungi tim CITS
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
            {member.isDemo && (
              <p className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                Data contoh untuk preview, bukan profil anggota resmi CITS Indonesia.
              </p>
            )}
          </div>
        </div>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Profil tim CITS Indonesia</p>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-xl bg-orange-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Tutup
        </button>
      </footer>
    </dialog>
  );
}
