"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { UserRound, X } from "lucide-react";
import type { TeamMember } from "@/lib/team";

export default function TeamProfileDialog({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

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
      className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-32px))] max-w-none flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/55 open:flex dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-3 dark:border-white/10">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Profil anggota tim</p>
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
      <div className="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7 [overflow-wrap:anywhere]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            {member.photoUrl ? (
              <Image
                src={member.photoUrl}
                alt={`Foto ${member.name}`}
                fill
                unoptimized
                sizes="96px"
                className="object-cover object-top"
              />
            ) : (
              <UserRound aria-hidden="true" className="size-12" strokeWidth={1.5} />
            )}
          </div>
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-semibold leading-snug sm:text-2xl">
              {member.name}
            </h2>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-orange-700 dark:text-orange-400">
              {member.position}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Tim: {member.teamName || "Belum ditentukan"}
            </p>
          </div>
        </div>
        <section className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
          <h3 className="text-sm font-semibold">Tentang {member.name}</h3>
          <p
            id={descriptionId}
            className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300"
          >
            {member.description?.trim() || "Deskripsi anggota ini belum tersedia."}
          </p>
        </section>
        {member.isDemo && (
          <p className="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Data contoh untuk preview, bukan profil anggota resmi CITS Indonesia.
          </p>
        )}
      </div>
      <footer className="flex shrink-0 justify-end border-t border-slate-200 px-5 py-4 dark:border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-medium hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/15 dark:hover:bg-white/5"
        >
          Tutup
        </button>
      </footer>
    </dialog>
  );
}
