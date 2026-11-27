"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { citsApi } from "@/lib/api";
import {
  isTeamMemberListedOnAbout,
  isTeamPhotoUrl,
  parseTeamMember,
  type TeamMember,
  type TeamMemberInput,
} from "@/lib/team";
import TeamDialog, { teamButton, teamField, teamPrimary, teamSecondary } from "./TeamDialog";
import { TeamPhoto } from "./TeamMemberDetails";
import TeamAssignmentSelect from "./TeamAssignmentSelect";

type Draft = TeamMemberInput & { id?: string };

export default function TeamMemberEditor({
  initial,
  members,
  titleId,
  onSave,
  onClose,
}: {
  initial: Draft;
  members: readonly TeamMember[];
  titleId: string;
  onSave: (value: TeamMemberInput, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const id = useId();
  const busy = saving || uploading;
  const close = () => {
    if (!busy) onClose();
  };
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    setPhotoError("");
    if (!file.size) {
      setPhotoError("Pilih foto yang tidak kosong.");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"].includes(file.type)) {
      setPhotoError("Gunakan gambar PNG, JPEG, WebP, GIF, atau AVIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const result = await citsApi.uploadFile(file);
      if (!result.success || !result.data?.url) throw new Error(result.message || "Foto belum berhasil diunggah.");
      setDraft((current) => ({ ...current, photoUrl: result.data.url }));
    } catch (cause) {
      setPhotoError(cause instanceof Error ? cause.message : "Foto belum berhasil diunggah.");
    } finally {
      setUploading(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const parsed = parseTeamMember(draft);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(parsed.value, draft.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Anggota tim belum tersimpan.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <TeamDialog
      title={draft.id ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
      titleId={titleId}
      busy={busy}
      onClose={close}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 overflow-y-auto p-6">
          <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
            <div>
              <label htmlFor={`${id}-photo`} className="text-xs font-medium">
                Upload Foto Profil <span className="font-normal text-slate-600 dark:text-slate-300">(opsional)</span>
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <TeamPhoto
                  member={{
                    name: draft.name,
                    photoUrl: draft.photoUrl && isTeamPhotoUrl(draft.photoUrl) ? draft.photoUrl : null,
                  }}
                  large
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <label className={teamSecondary + " relative"}>
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      {uploading ? "Mengunggah..." : "Pilih Foto"}
                      <input
                        id={`${id}-photo`}
                        aria-describedby={`${id}-photo-help ${id}-photo-error`}
                        aria-invalid={Boolean(photoError)}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        onChange={upload}
                        className="absolute inset-0 w-full cursor-pointer opacity-0"
                      />
                    </label>
                    {draft.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setDraft({ ...draft, photoUrl: null });
                          setPhotoError("");
                        }}
                        className={
                          teamButton + " px-2 text-slate-600 dark:text-slate-300 hover:text-red-700 dark:text-red-300"
                        }
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  <p id={`${id}-photo-help`} className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    PNG, JPEG, WebP, GIF, atau AVIF.
                    <br />
                    Maksimal 5 MB.
                  </p>
                </div>
              </div>
              <p
                id={`${id}-photo-error`}
                role={photoError ? "alert" : undefined}
                className="mt-2 text-xs text-red-700 dark:text-red-300"
              >
                {photoError}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor={`${id}-name`} className="block text-xs font-medium sm:col-span-2">
                Nama Lengkap <span className="text-red-700 dark:text-red-300">*</span>
                <input
                  autoFocus
                  id={`${id}-name`}
                  name="name"
                  required
                  maxLength={120}
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className={teamField}
                />
              </label>
              <TeamAssignmentSelect
                id={`${id}-position`}
                label="Jabatan"
                required
                maxLength={160}
                value={draft.position}
                options={members.map((member) => member.position)}
                onChange={(position) => setDraft({ ...draft, position })}
                newLabel="Tambah jabatan baru"
                newFieldLabel="Jabatan baru"
                placeholder="Contoh: Project Manager"
              />
              <TeamAssignmentSelect
                id={`${id}-team`}
                label="Tim"
                maxLength={100}
                value={draft.teamName ?? ""}
                options={members.map((member) => member.teamName ?? "")}
                onChange={(teamName) => setDraft({ ...draft, teamName })}
                newLabel="Tambah tim baru"
                newFieldLabel="Nama tim baru"
                placeholder="Contoh: Pengembangan Aplikasi"
              />
              <label htmlFor={`${id}-description`} className="block text-xs font-medium sm:col-span-2">
                Tentang anggota <span className="font-normal text-slate-600 dark:text-slate-300">(opsional)</span>
                <textarea
                  id={`${id}-description`}
                  name="description"
                  rows={5}
                  maxLength={3000}
                  value={draft.description ?? ""}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="Ceritakan peran, keahlian, pengalaman, atau fokus pekerjaan anggota ini."
                  className={teamField + " resize-y leading-6"}
                  aria-describedby={`${id}-description-help`}
                />
                <span
                  id={`${id}-description-help`}
                  className="mt-2 block text-xs font-normal leading-5 text-slate-600 dark:text-slate-300"
                >
                  Ditampilkan pada detail profil di Tentang Kami.{" "}
                  {(draft.description ?? "").length.toLocaleString("id-ID")}/3.000 karakter.
                </span>
              </label>
              <fieldset className="grid min-w-0 gap-4 rounded-xl border border-slate-200 p-4 sm:col-span-2 sm:grid-cols-2 dark:border-white/10">
                <legend className="px-1 text-xs font-semibold">Detail profil publik (opsional)</legend>
                {(
                  [
                    ["serviceFocus", "Fokus layanan"],
                    ["availability", "Ketersediaan"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="block min-w-0 text-xs font-medium">
                    {label}
                    <input
                      name={field}
                      maxLength={200}
                      value={draft[field] ?? ""}
                      onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
                      className={teamField}
                    />
                  </label>
                ))}
                {(
                  [
                    ["expertise", "Bidang keahlian", 80],
                    ["projectRoles", "Peran dalam proyek", 300],
                  ] as const
                ).map(([field, label, limit]) => (
                  <label key={field} className="block min-w-0 text-xs font-medium sm:col-span-2">
                    {label}
                    <textarea
                      name={field}
                      rows={3}
                      maxLength={12 * (limit + 1) - 1}
                      value={draft[field]?.join("\n") ?? ""}
                      onChange={(event) => setDraft({ ...draft, [field]: event.target.value.split("\n") })}
                      className={teamField + " resize-y leading-6"}
                    />
                    <span className="mt-2 block font-normal text-slate-600 dark:text-slate-300">
                      Satu poin per baris, maksimal 12 poin dan {limit} karakter per baris.
                    </span>
                  </label>
                ))}
              </fieldset>
              <label htmlFor={`${id}-order`} className="block text-xs font-medium">
                Urutan Tampil <span className="text-red-700 dark:text-red-300">*</span>
                <input
                  id={`${id}-order`}
                  name="displayOrder"
                  type="number"
                  required
                  min={0}
                  max={9999}
                  step={1}
                  value={Number.isNaN(draft.displayOrder) ? "" : (draft.displayOrder ?? 0)}
                  onChange={(event) => setDraft({ ...draft, displayOrder: event.target.valueAsNumber })}
                  placeholder="Contoh: 1"
                  className={teamField}
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-slate-600 dark:text-slate-300">
                  Angka lebih kecil tampil lebih dahulu. Gunakan 0–9999.
                </span>
              </label>
              <div>
                <label htmlFor={`${id}-status`} className="block text-xs font-medium">
                  Status
                </label>
                <select
                  id={`${id}-status`}
                  name="isActive"
                  value={draft.isActive !== false ? "active" : "inactive"}
                  onChange={(event) => setDraft({ ...draft, isActive: event.target.value === "active" })}
                  className={teamField}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="showOnHomepage"
                checked={isTeamMemberListedOnAbout(draft)}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    showOnHomepage: event.target.checked,
                    showDemoOnAbout: draft.isDemo === true && event.target.checked,
                  })
                }
                className="h-4 w-4 accent-[#F45100]"
              />
              {draft.isDemo ? "Tampilkan di Tentang Kami sebagai data contoh" : "Tampilkan di Tentang Kami"}
            </label>
            <details className="border-t border-slate-200 dark:border-white/10 pt-4">
              <summary className="cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
                Pilihan lainnya
              </summary>
              <label htmlFor={`${id}-photo-url`} className="mt-4 block text-xs font-medium">
                URL Foto
                <input
                  id={`${id}-photo-url`}
                  value={draft.photoUrl?.startsWith("data:") ? "" : (draft.photoUrl ?? "")}
                  onChange={(event) => setDraft({ ...draft, photoUrl: event.target.value || null })}
                  placeholder="https://... atau /foto-tim.webp"
                  className={teamField}
                />
              </label>
              <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={draft.isDemo === true}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      isDemo: event.target.checked,
                      showOnHomepage: isTeamMemberListedOnAbout(draft),
                      showDemoOnAbout: false,
                    })
                  }
                  className="h-4 w-4 accent-[#F45100]"
                />
                Tandai sebagai data contoh
              </label>
            </details>
          </fieldset>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          {uploading && (
            <p role="status" className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Mengunggah foto profil...
            </p>
          )}
        </div>
        <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-200 dark:border-white/10 px-6 py-4">
          <button type="button" onClick={close} disabled={busy} className={teamSecondary}>
            Batal
          </button>
          <button type="submit" disabled={busy} className={teamPrimary}>
            {saving ? "Menyimpan..." : uploading ? "Mengunggah..." : "Simpan"}
          </button>
        </footer>
      </form>
    </TeamDialog>
  );
}
