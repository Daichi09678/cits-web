"use client";

import { useId, useRef, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import TeamDialog, { teamButton, teamPrimary, teamSecondary } from "@/components/admin/team/TeamDialog";
import TeamMemberEditor from "@/components/admin/team/TeamMemberEditor";
import TeamMemberDetails, { TeamPhoto, TeamStatus } from "@/components/admin/team/TeamMemberDetails";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { citsApi } from "@/lib/api";
import { announceTeamUpdate, useTeamMembers } from "@/lib/teamClient";
import { sortTeamMembers, type TeamMember, type TeamMemberInput } from "@/lib/team";

const blank: TeamMemberInput = {
  name: "",
  position: "",
  photoUrl: null,
  displayOrder: 0,
  isActive: true,
  showOnHomepage: true,
};

export default function AdminTeamPage() {
  const { session } = useAdminAuth();
  const canCreate = canPerformAction(session?.user, "team", "create");
  const canEdit = canPerformAction(session?.user, "team", "edit");
  const canDelete = canPerformAction(session?.user, "team", "delete");
  const { members, setMembers, loading, error, reload } = useTeamMembers(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [draft, setDraft] = useState<(TeamMemberInput & { id?: string }) | null>(null);
  const [detail, setDetail] = useState<TeamMember | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [success, setSuccess] = useState("");
  const titleId = useId();
  const opener = useRef<HTMLElement | null>(null);
  const sorted = sortTeamMembers(members);
  const filtered = sorted.filter((member) => {
    const matchesQuery = `${member.name} ${member.position}`
      .toLocaleLowerCase("id")
      .includes(query.trim().toLocaleLowerCase("id"));
    const active = member.isActive !== false;
    return matchesQuery && (status === "all" || (status === "active" ? active : !active));
  });
  const rememberOpener = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMutationError("");
    setSuccess("");
  };
  const close = () => {
    if (saving) return;
    setDraft(null);
    setDetail(null);
    setPendingDelete(null);
    setMutationError("");
    requestAnimationFrame(() => opener.current?.focus());
  };
  const openEditor = (member?: TeamMember, fromDetail = false) => {
    if (!fromDetail) rememberOpener();
    setDetail(null);
    setDraft(
      member
        ? { ...member }
        : { ...blank, displayOrder: Math.min(9999, Math.max(0, ...members.map((item) => item.displayOrder ?? 0)) + 1) }
    );
  };
  async function save(value: TeamMemberInput, id?: string) {
    const saved = id ? await citsApi.updateTeamMember(id, value) : await citsApi.createTeamMember(value);
    setMembers((current) => [...current.filter((item) => item.id !== saved.id), saved]);
    setSuccess(id ? "Perubahan anggota tim berhasil disimpan." : "Anggota tim berhasil ditambahkan.");
    close();
    announceTeamUpdate();
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-slate-50/70 text-slate-900 dark:bg-[#0F0F1A] dark:text-white">
      <AdminTopbar title="Tim Kami" description="Kelola anggota tim yang tampil di website." />
      <div className="p-4 sm:p-6 lg:p-8">
        <section
          aria-labelledby="team-members-heading"
          className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151528] shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-200 dark:border-white/10 px-5 py-6 sm:px-6">
            <div className="border-l-4 border-[#F45100] pl-4">
              <h2 id="team-members-heading" className="text-lg font-bold">
                Anggota Tim
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Beranda menampilkan maksimal empat anggota aktif sesuai urutan yang Anda tentukan. Gunakan data dan foto
                resmi tim.
              </p>
            </div>
            {canCreate && (
              <button
                type="button"
                onClick={() => openEditor()}
                disabled={loading || Boolean(error)}
                className={teamPrimary}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Tambah Anggota
              </button>
            )}
          </div>
          <div className="px-5 py-5 sm:px-6">
            {success && (
              <p
                role="status"
                className="mb-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm text-green-800 dark:text-green-200"
              >
                {success}
              </p>
            )}
            {!pendingDelete && mutationError && (
              <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">
                {mutationError}
              </p>
            )}
            {error && (
              <div
                role="alert"
                className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-200"
              >
                <p>{error}</p>
                <button type="button" onClick={() => void reload()} className={teamSecondary}>
                  Coba lagi
                </button>
              </div>
            )}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <label htmlFor="team-search" className="sr-only">
                  Cari nama atau jabatan
                </label>
                <Search
                  className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-600 dark:text-slate-300"
                  aria-hidden="true"
                />
                <input
                  id="team-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama atau jabatan..."
                  className="min-h-11 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151528] py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#F45100] focus:outline-2 focus:outline-[#F45100]/20"
                />
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="team-status" className="text-xs text-slate-600 dark:text-slate-300">
                  Status
                </label>
                <select
                  id="team-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="min-h-11 flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151528] px-3 py-2 text-sm font-medium focus:outline-2 focus:outline-[#F45100]/30 sm:min-w-36"
                >
                  <option value="all">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p
                role="status"
                aria-busy="true"
                className="py-16 text-center text-sm text-slate-600 dark:text-slate-300"
              >
                Memuat anggota tim...
              </p>
            ) : !error && !filtered.length ? (
              <div className="border-y border-slate-200 dark:border-white/10 py-16 text-center">
                <h3 className="text-sm font-semibold">
                  {members.length ? "Anggota tidak ditemukan" : "Belum ada anggota tim"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {members.length
                    ? "Coba nama atau jabatan lain, atau ubah filter status."
                    : "Tambahkan anggota tim untuk ditampilkan di website."}
                </p>
                {members.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                    }}
                    className={teamSecondary + " mt-4"}
                  >
                    Reset pencarian
                  </button>
                )}
                {canCreate && !members.length && (
                  <details className="mt-5 text-xs text-slate-600 dark:text-slate-300">
                    <summary className="cursor-pointer">Opsi data contoh</summary>
                    <p className="mt-2">Gunakan hanya untuk pengujian, bukan identitas resmi perusahaan.</p>
                    <button
                      type="button"
                      disabled={seeding}
                      className={teamSecondary + " mt-3"}
                      onClick={async () => {
                        setSeeding(true);
                        setMutationError("");
                        setSuccess("");
                        try {
                          const examples = await citsApi.seedTeamExamples();
                          setMembers(examples);
                          announceTeamUpdate();
                          setSuccess("Data contoh ditambahkan. Ganti dengan data resmi sebelum dipublikasikan.");
                        } catch (cause) {
                          setMutationError(cause instanceof Error ? cause.message : "Data contoh belum tersimpan.");
                        } finally {
                          setSeeding(false);
                        }
                      }}
                    >
                      {seeding ? "Mengisi data contoh..." : "Isi Data Contoh"}
                    </button>
                  </details>
                )}
              </div>
            ) : (
              !error && (
                <div>
                  <div
                    aria-hidden="true"
                    className="hidden grid-cols-[minmax(0,1fr)_72px_110px_244px] gap-4 border-b border-slate-200 dark:border-white/10 px-3 pb-3 text-xs font-medium text-slate-600 dark:text-slate-300 lg:grid"
                  >
                    <span>Nama &amp; jabatan</span>
                    <span>Urutan</span>
                    <span>Status</span>
                    <span className="text-right">Aksi</span>
                  </div>
                  <ul className="divide-y divide-slate-200 dark:divide-white/10">
                    {filtered.map((member) => (
                      <li
                        key={member.id}
                        className="grid min-w-0 gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_72px_110px_244px] lg:items-center lg:px-3"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <TeamPhoto member={member} />
                          <div className="min-w-0 [overflow-wrap:anywhere]">
                            <h3 className="text-sm font-semibold">{member.name}</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{member.position}</p>
                            {member.isDemo && (
                              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Data contoh</p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          <span className="lg:sr-only">Urutan: </span>
                          {member.displayOrder ?? 0}
                        </p>
                        <TeamStatus active={member.isActive !== false} />
                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            aria-label={`Detail ${member.name}`}
                            onClick={() => {
                              rememberOpener();
                              setDetail(member);
                            }}
                            className={
                              teamButton +
                              " px-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                            }
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Detail
                          </button>
                          {canEdit && (
                            <button
                              type="button"
                              aria-label={`Edit ${member.name}`}
                              onClick={() => openEditor(member)}
                              className={teamSecondary + " px-3"}
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              aria-label={`Hapus ${member.name}`}
                              title={`Hapus ${member.name}`}
                              onClick={() => {
                                rememberOpener();
                                setPendingDelete(member);
                              }}
                              className={
                                teamButton + " w-11 px-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              }
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
            {!loading && !error && (
              <p
                aria-live="polite"
                className="mt-1 border-t border-slate-200 dark:border-white/10 pt-5 text-sm text-slate-600 dark:text-slate-300"
              >
                Menampilkan {filtered.length} dari {members.length} anggota
              </p>
            )}
          </div>
        </section>
      </div>
      {draft && <TeamMemberEditor initial={draft} titleId={titleId} onSave={save} onClose={close} />}
      {detail && (
        <TeamMemberDetails
          member={members.find((member) => member.id === detail.id) ?? detail}
          titleId={titleId}
          canEdit={canEdit}
          onClose={close}
          onEdit={() => openEditor(members.find((member) => member.id === detail.id) ?? detail, true)}
        />
      )}
      {pendingDelete && (
        <TeamDialog title="Hapus Anggota Tim?" titleId={titleId} busy={saving} onClose={close}>
          <div className="p-6">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">{pendingDelete.name}</strong> akan
              dihapus dari daftar tim dan tidak lagi tampil di website.
            </p>
            {mutationError && (
              <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">
                {mutationError}
              </p>
            )}
          </div>
          <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-200 dark:border-white/10 px-6 py-4">
            <button autoFocus type="button" onClick={close} disabled={saving} className={teamSecondary}>
              Batal
            </button>
            <button
              type="button"
              disabled={saving}
              className={teamButton + " bg-red-600 text-white hover:bg-red-700"}
              onClick={async () => {
                setSaving(true);
                setMutationError("");
                try {
                  await citsApi.deleteTeamMember(pendingDelete.id);
                  setMembers((current) => current.filter((member) => member.id !== pendingDelete.id));
                  setPendingDelete(null);
                  setSuccess("Anggota tim berhasil dihapus.");
                  announceTeamUpdate();
                  requestAnimationFrame(() => document.getElementById("team-search")?.focus());
                } catch (cause) {
                  setMutationError(cause instanceof Error ? cause.message : "Anggota tim belum terhapus.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Menghapus..." : "Hapus Anggota"}
            </button>
          </footer>
        </TeamDialog>
      )}
    </div>
  );
}
