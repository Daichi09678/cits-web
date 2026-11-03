"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminDialogSurface from "@/components/admin/AdminDialogSurface";
import { useAdminAuth } from "@/lib/auth";
import { canPerformAction } from "@/lib/internalAccess";
import { citsApi } from "@/lib/api";
import { announceTeamUpdate, useTeamMembers } from "@/lib/teamClient";
import { isTeamPhotoUrl, parseTeamMember, sortTeamMembers, type TeamMember, type TeamMemberInput } from "@/lib/team";

const button =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:outline-orange-300";
const primary = button + " bg-orange-700 text-white hover:bg-orange-800";
const secondary =
  button +
  " border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10";
const field =
  "mt-2 min-h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/20 dark:bg-[#121222] dark:text-white dark:focus-visible:outline-orange-300";
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
  const [draft, setDraft] = useState<(TeamMemberInput & { id?: string }) | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [success, setSuccess] = useState("");
  const titleId = useId();
  const opener = useRef<HTMLElement | null>(null);
  const sorted = sortTeamMembers(members);
  const filtered = sorted.filter((member) =>
    `${member.name} ${member.position}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id"))
  );
  const openEditor = (member?: TeamMember) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMutationError("");
    setSuccess("");
    setDraft(
      member
        ? { ...member }
        : { ...blank, displayOrder: Math.min(9999, Math.max(0, ...members.map((item) => item.displayOrder ?? 0)) + 1) }
    );
  };
  const close = () => {
    if (!saving && !uploading) {
      setDraft(null);
      setPendingDelete(null);
      setMutationError("");
      const target = opener.current;
      requestAnimationFrame(() => target?.focus());
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AdminTopbar title="Tim Kami" description="Kelola anggota tim yang tampil di website." />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Anggota Tim</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Beranda menampilkan maksimal empat anggota aktif sesuai urutan yang Anda tentukan. Gunakan data dan foto
              resmi tim.
            </p>
          </div>
          {canCreate && (
            <button type="button" onClick={() => openEditor()} disabled={loading || Boolean(error)} className={primary}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah Anggota
            </button>
          )}
        </div>
        {canCreate && !loading && !error && !members.length && (
          <button
            type="button"
            disabled={seeding}
            className={secondary}
            onClick={async () => {
              setSeeding(true);
              setSuccess("");
              try {
                const examples = await citsApi.seedTeamExamples();
                setMembers(examples);
                announceTeamUpdate();
                setSuccess(
                  "Empat anggota contoh berhasil ditambahkan. Ganti dengan data resmi sebelum dipublikasikan sebagai tim perusahaan."
                );
              } catch (cause) {
                setMutationError(cause instanceof Error ? cause.message : "Data contoh belum tersimpan.");
              } finally {
                setSeeding(false);
              }
            }}
          >
            {seeding ? "Mengisi data contoh..." : "Isi Data Contoh"}
          </button>
        )}
        {!draft && !pendingDelete && mutationError && (
          <p role="alert" className="text-sm text-rose-800 dark:text-rose-300">
            {mutationError}
          </p>
        )}
        {success && (
          <p
            role="status"
            className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            {success}
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
          >
            <p>{error}</p>
            <button type="button" onClick={() => void reload()} className={secondary}>
              Coba lagi
            </button>
          </div>
        )}
        <label className="block max-w-md text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="team-search">
          Cari nama atau jabatan
          <input
            id="team-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={field}
            placeholder="Cari anggota tim"
          />
        </label>
        {loading ? (
          <p role="status" aria-busy="true" className="py-8 text-sm text-slate-600 dark:text-slate-300">
            Memuat anggota tim...
          </p>
        ) : !error && !filtered.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#151528]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {members.length ? "Anggota tidak ditemukan" : "Belum ada anggota tim"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {members.length
                ? "Coba nama atau jabatan lain."
                : "Tambahkan nama, jabatan, dan foto anggota untuk mengisi bagian Tim Kami di beranda."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#151528]">
            {filtered.map((member) => (
              <li key={member.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={`Foto ${member.name}`}
                        width={80}
                        height={80}
                        unoptimized
                        className="h-20 w-20 object-cover object-top"
                      />
                    ) : (
                      <span className="px-2 text-center text-xs text-slate-600 dark:text-slate-300">
                        Belum ada foto
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 [overflow-wrap:anywhere]">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                    {member.isDemo && (
                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Data contoh</p>
                    )}
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{member.position}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      Urutan {member.displayOrder ?? 0} · {member.isActive !== false ? "Aktif" : "Nonaktif"} ·{" "}
                      {member.isActive !== false && member.showOnHomepage !== false
                        ? "Ditampilkan di beranda"
                        : "Disembunyikan dari beranda"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => openEditor(member)}
                      className={secondary}
                      aria-label={`Edit ${member.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        setMutationError("");
                        setSuccess("");
                        setPendingDelete(member);
                      }}
                      className={
                        button + " text-rose-800 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30"
                      }
                      aria-label={`Hapus ${member.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Hapus
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {draft && (
        <AdminDialogSurface labelledBy={titleId} onClose={close} widthClassName="w-[min(620px,calc(100vw-32px))]">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
            <h2 id={titleId} className="text-lg font-bold">
              {draft.id ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
            </h2>
            <button
              type="button"
              aria-label="Tutup editor tim"
              onClick={close}
              disabled={saving || uploading}
              className={secondary + " px-3"}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <form
            className="min-h-0 overflow-y-auto p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (saving || uploading) return;
              const parsed = parseTeamMember(draft);
              if (!parsed.ok) {
                setMutationError(parsed.message);
                return;
              }
              setSaving(true);
              setMutationError("");
              try {
                const saved = draft.id
                  ? await citsApi.updateTeamMember(draft.id, parsed.value)
                  : await citsApi.createTeamMember(parsed.value);
                setMembers((current) => [...current.filter((item) => item.id !== saved.id), saved]);
                setSuccess(draft.id ? "Perubahan anggota tim berhasil disimpan." : "Anggota tim berhasil ditambahkan.");
                setDraft(null);
                announceTeamUpdate();
              } catch (cause) {
                setMutationError(cause instanceof Error ? cause.message : "Anggota tim belum tersimpan.");
              } finally {
                setSaving(false);
              }
            }}
          >
            <fieldset disabled={saving || uploading} className="space-y-5 disabled:opacity-60">
              <label className="block text-sm font-medium" htmlFor="team-name">
                Nama lengkap
                <input
                  autoFocus
                  id="team-name"
                  required
                  maxLength={120}
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className={field}
                />
              </label>
              <label className="block text-sm font-medium" htmlFor="team-position">
                Jabatan
                <input
                  id="team-position"
                  required
                  maxLength={160}
                  value={draft.position}
                  onChange={(event) => setDraft({ ...draft, position: event.target.value })}
                  className={field}
                />
              </label>
              <div className="space-y-3">
                {draft.photoUrl && isTeamPhotoUrl(draft.photoUrl) && (
                  <Image
                    src={draft.photoUrl}
                    alt="Pratinjau foto anggota tim"
                    width={120}
                    height={120}
                    unoptimized
                    className="h-28 w-28 rounded-lg object-cover object-top"
                  />
                )}
                <label htmlFor="team-photo" className="block text-sm font-medium">
                  Unggah foto
                  <input
                    id="team-photo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    className={field + " cursor-pointer"}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      setMutationError("");
                      try {
                        const result = await citsApi.uploadFile(file);
                        if (!result.success || !result.data?.url)
                          throw new Error(result.message || "Foto belum berhasil diunggah.");
                        setDraft((current) => (current ? { ...current, photoUrl: result.data.url } : null));
                      } catch (cause) {
                        setMutationError(cause instanceof Error ? cause.message : "Foto belum berhasil diunggah.");
                      } finally {
                        setUploading(false);
                        event.target.value = "";
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  PNG, JPEG, WebP, GIF, atau AVIF. Maksimal 5 MB. Foto bersifat opsional.
                </p>
                <label htmlFor="team-photo-url" className="block text-sm font-medium">
                  Atau gunakan URL foto
                  <input
                    id="team-photo-url"
                    value={draft.photoUrl?.startsWith("data:") ? "" : (draft.photoUrl ?? "")}
                    onChange={(event) => setDraft({ ...draft, photoUrl: event.target.value || null })}
                    placeholder="https://... atau /foto-tim.webp"
                    className={field}
                  />
                </label>
                {draft.photoUrl && (
                  <button type="button" className={secondary} onClick={() => setDraft({ ...draft, photoUrl: null })}>
                    Hapus foto
                  </button>
                )}
              </div>
              <label htmlFor="team-order" className="block text-sm font-medium">
                Urutan tampil
                <input
                  id="team-order"
                  type="number"
                  required
                  min={0}
                  max={9999}
                  step={1}
                  value={draft.displayOrder ?? 0}
                  onChange={(event) => setDraft({ ...draft, displayOrder: event.target.valueAsNumber })}
                  className={field}
                />
                <span className="mt-2 block text-xs text-slate-600 dark:text-slate-300">
                  Angka lebih kecil ditampilkan lebih dahulu.
                </span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isActive !== false}
                  onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
                  className="h-5 w-5 cursor-pointer accent-orange-700"
                />
                Anggota aktif
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.showOnHomepage !== false}
                  onChange={(event) => setDraft({ ...draft, showOnHomepage: event.target.checked })}
                  className="h-5 w-5 cursor-pointer accent-orange-700"
                />
                Tampilkan di beranda
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isDemo === true}
                  onChange={(event) => setDraft({ ...draft, isDemo: event.target.checked })}
                  className="h-5 w-5 cursor-pointer accent-orange-700"
                />
                Data contoh (bukan anggota resmi)
              </label>
            </fieldset>
            {mutationError && (
              <p role="alert" className="mt-4 text-sm text-rose-800 dark:text-rose-300">
                {mutationError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
              <button type="button" onClick={close} disabled={saving || uploading} className={secondary}>
                Batal
              </button>
              <button type="submit" disabled={saving || uploading} className={primary}>
                {saving ? "Menyimpan..." : uploading ? "Mengunggah foto..." : "Simpan Anggota"}
              </button>
            </div>
          </form>
        </AdminDialogSurface>
      )}
      {pendingDelete && (
        <AdminDialogSurface labelledBy={titleId} onClose={close} widthClassName="w-[min(480px,calc(100vw-32px))]">
          <div className="p-6">
            <h2 id={titleId} className="text-lg font-bold">
              Hapus anggota tim?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {pendingDelete.name} akan dihapus dari daftar tim dan tidak lagi tampil di website.
            </p>
            {mutationError && (
              <p role="alert" className="mt-4 text-sm text-rose-800 dark:text-rose-300">
                {mutationError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button autoFocus type="button" onClick={close} disabled={saving} className={secondary}>
                Batal
              </button>
              <button
                type="button"
                disabled={saving}
                className={button + " bg-rose-700 text-white hover:bg-rose-800"}
                onClick={async () => {
                  setSaving(true);
                  setMutationError("");
                  try {
                    await citsApi.deleteTeamMember(pendingDelete.id);
                    setMembers((current) => current.filter((member) => member.id !== pendingDelete.id));
                    setPendingDelete(null);
                    setSuccess("Anggota tim berhasil dihapus.");
                    announceTeamUpdate();
                  } catch (cause) {
                    setMutationError(cause instanceof Error ? cause.message : "Anggota tim belum terhapus.");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Menghapus..." : "Hapus Anggota"}
              </button>
            </div>
          </div>
        </AdminDialogSurface>
      )}
    </div>
  );
}
