"use client";

import Image from "next/image";
import { Pencil, UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/team";
import TeamDialog, { teamPrimary, teamSecondary } from "./TeamDialog";

export function TeamPhoto({
  member,
  large = false,
}: {
  member: Pick<TeamMember, "name" | "photoUrl">;
  large?: boolean;
}) {
  const size = large ? 80 : 48;
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F5F9] text-[#64748B] ${large ? "h-20 w-20" : "h-12 w-12"}`}
    >
      {member.photoUrl ? (
        <Image
          src={member.photoUrl}
          alt={`Foto ${member.name || "anggota tim"}`}
          width={size}
          height={size}
          unoptimized
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <UserRound className={large ? "h-8 w-8" : "h-5 w-5"} aria-label="Belum ada foto" />
      )}
    </div>
  );
}

export function TeamStatus({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-[#64748B]">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${active ? "bg-green-600" : "bg-slate-400"}`} />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function memberDate(member: TeamMember, key: "createdAt" | "updatedAt") {
  const value: unknown = key in member ? member[key as keyof TeamMember] : undefined;
  if (typeof value !== "string" || !value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "—"
    : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function TeamMemberDetails({
  member,
  titleId,
  canEdit,
  onClose,
  onEdit,
}: {
  member: TeamMember;
  titleId: string;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  const info = [
    ["Urutan tampil", String(member.displayOrder ?? 0)],
    [
      "Ditampilkan di beranda",
      member.isActive !== false && member.showOnHomepage !== false ? "Ya, sesuai urutan (maksimal 4 anggota)" : "Tidak",
    ],
    ["Tanggal ditambahkan", memberDate(member, "createdAt")],
    ["Terakhir diperbarui", memberDate(member, "updatedAt")],
  ];
  return (
    <TeamDialog title="Detail Anggota" titleId={titleId} onClose={onClose}>
      <div className="overflow-y-auto p-6">
        <div className="flex items-center gap-4">
          <TeamPhoto member={member} large />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="mb-2 mt-1 text-sm text-[#64748B]">{member.position}</p>
            <TeamStatus active={member.isActive !== false} />
          </div>
        </div>
        <dl className="mt-6 divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
          {info.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 text-sm sm:grid-cols-[160px_1fr] sm:gap-4">
              <dt className="text-[#64748B]">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {member.isDemo && <p className="text-xs text-[#64748B]">Data contoh, bukan anggota resmi.</p>}
      </div>
      <footer className="flex shrink-0 justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
        <button type="button" onClick={onClose} className={teamSecondary}>
          Tutup
        </button>
        {canEdit && (
          <button type="button" onClick={onEdit} className={teamPrimary}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
        )}
      </footer>
    </TeamDialog>
  );
}
