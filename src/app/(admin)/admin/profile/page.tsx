"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  IdCard,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import UserAvatar from "@/components/admin/UserAvatar";
import { useAdminDialog } from "@/components/admin/AdminDialogProvider";
import { useAdminAuth } from "@/lib/auth";
import { fetchAdminProfile, saveAdminProfile } from "@/lib/profileApi";
import {
  EMPTY_PROFILE_INPUT,
  calculateProfileCompletion,
  normalizeProfileInput,
  type AdminProfile,
  type AdminProfileInput,
} from "@/lib/profile";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white";

const readonlyClass =
  "w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 shadow-sm outline-none dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400";

function formatDate(value: string | undefined, withTime = false): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Foto tidak bisa dibaca."));
    };
    image.src = objectUrl;
  });
}

async function fileToAvatarDataUrl(file: File): Promise<string> {
  const image = await loadImage(file);
  const size = 320;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas tidak tersedia.");

  const scale = Math.max(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);

  return canvas.toDataURL("image/webp", 0.8);
}

function ProfileField({
  label,
  htmlFor,
  icon: Icon,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  icon: LucideIcon;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
        >
          <Icon className="h-3.5 w-3.5 text-orange-500" />
          {label}
        </label>
        {hint && <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-56 rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151528]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[520px] rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151528]" />
          <div className="h-80 rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151528]" />
        </div>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const { session, updateUser } = useAdminAuth();
  const dialog = useAdminDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [form, setForm] = useState<AdminProfileInput>(EMPTY_PROFILE_INPUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  function applyProfile(data: AdminProfile) {
    setProfile(data);
    setForm({
      displayName: data.displayName,
      jobTitle: data.jobTitle,
      phone: data.phone,
      birthDate: data.birthDate,
      location: data.location,
      bio: data.bio,
      website: data.website,
      avatarUrl: data.avatarUrl,
    });
  }

  async function loadProfile() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchAdminProfile();
      applyProfile(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Gagal memuat profil.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchAdminProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setForm({
          displayName: data.displayName,
          jobTitle: data.jobTitle,
          phone: data.phone,
          birthDate: data.birthDate,
          location: data.location,
          bio: data.bio,
          website: data.website,
          avatarUrl: data.avatarUrl,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Gagal memuat profil.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const completion = useMemo(() => calculateProfileCompletion(form), [form]);

  const isDirty = useMemo(() => {
    if (!profile) return false;
    return (
      form.displayName !== profile.displayName ||
      form.jobTitle !== profile.jobTitle ||
      form.phone !== profile.phone ||
      form.birthDate !== profile.birthDate ||
      form.location !== profile.location ||
      form.bio !== profile.bio ||
      form.website !== profile.website ||
      form.avatarUrl !== profile.avatarUrl
    );
  }, [form, profile]);

  const completionItems = [
    { label: "Nama lengkap", done: form.displayName.trim().length > 0 },
    { label: "Jabatan", done: form.jobTitle.trim().length > 0 },
    { label: "Nomor telepon", done: form.phone.trim().length > 0 },
    { label: "Tanggal lahir", done: form.birthDate.trim().length > 0 },
    { label: "Domisili", done: form.location.trim().length > 0 },
    { label: "Bio singkat", done: form.bio.trim().length > 0 },
    { label: "Foto profil", done: form.avatarUrl.trim().length > 0 },
  ];

  function updateField<K extends keyof AdminProfileInput>(field: K, value: AdminProfileInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError("");
    if (!file.type.startsWith("image/")) {
      setAvatarError("Pilih berkas gambar (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setAvatarError("Ukuran foto maksimal 8 MB.");
      return;
    }

    setAvatarBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      updateField("avatarUrl", dataUrl);
    } catch {
      setAvatarError("Foto gagal diproses. Coba gambar lain.");
    } finally {
      setAvatarBusy(false);
    }
  }

  function handleReset() {
    if (!profile) return;
    setForm({
      displayName: profile.displayName,
      jobTitle: profile.jobTitle,
      phone: profile.phone,
      birthDate: profile.birthDate,
      location: profile.location,
      bio: profile.bio,
      website: profile.website,
      avatarUrl: profile.avatarUrl,
    });
    setAvatarError("");
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const parsed = normalizeProfileInput(form);
    if (!parsed.ok) {
      await dialog.alert({
        title: "Periksa kembali data profil",
        description: parsed.message,
        variant: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      const saved = await saveAdminProfile(parsed.value);
      setProfile(saved);
      setForm({
        displayName: saved.displayName,
        jobTitle: saved.jobTitle,
        phone: saved.phone,
        birthDate: saved.birthDate,
        location: saved.location,
        bio: saved.bio,
        website: saved.website,
        avatarUrl: saved.avatarUrl,
      });
      updateUser({
        name: saved.displayName,
        avatar: saved.avatarUrl,
        jobTitle: saved.jobTitle,
      });
      await dialog.alert({
        title: "Profil berhasil diperbarui",
        description: "Perubahan identitas dan foto profil sudah tersimpan permanen.",
        variant: "success",
      });
    } catch (error) {
      await dialog.alert({
        title: "Profil gagal disimpan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan profil.",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  }

  const roleIsSuperadmin = String(profile?.role || session?.user.role || "")
    .toLowerCase()
    .includes("super");

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar title="Profil Saya" description="Kelola identitas, kontak, dan foto profil akun back office." />

      {loading ? (
        <ProfileSkeleton />
      ) : loadError ? (
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-rose-900/50 dark:bg-[#151528]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">Profil belum bisa dimuat</h2>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void loadProfile()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-600/20 transition-colors hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4" />
              Coba lagi
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white p-4 sm:p-6 lg:p-8 dark:bg-[#0F0F1A]">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Kartu identitas utama */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#151528]">
              <div className="px-5 py-6 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative w-fit">
                    <div className="rounded-[1.75rem] border-4 border-white bg-white p-1 shadow-xl shadow-slate-900/10 dark:border-[#151528] dark:bg-[#151528]">
                      <UserAvatar
                        key={form.avatarUrl}
                        src={form.avatarUrl}
                        name={form.displayName || session?.user.name || "Administrator"}
                        size={112}
                        className="rounded-[1.35rem]"
                        textClassName="text-3xl"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Ganti foto profil"
                      aria-label="Ganti foto profil"
                      className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-600 text-white shadow-lg shadow-orange-600/30 transition-transform hover:scale-105 hover:bg-orange-700 dark:border-[#151528]"
                    >
                      {avatarBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div className="min-w-0 flex-1 sm:pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                        {form.displayName || "Nama Administrator"}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          roleIsSuperadmin
                            ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300"
                            : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300"
                        }`}
                      >
                        <BadgeCheck className="h-3 w-3" />
                        {profile?.role || session?.user.role || "Admin"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <ShieldCheck className="h-3 w-3" />
                        Akun terverifikasi
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-orange-500" />
                      {form.jobTitle || "Lengkapi jabatan Anda"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {profile?.email || session?.user.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {form.location || "Domisili belum diisi"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:pb-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarBusy}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-bold text-slate-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-orange-300"
                    >
                      <PencilLine className="h-3.5 w-3.5" />
                      Ganti Foto
                    </button>
                    {form.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => updateField("avatarUrl", "")}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {avatarError && (
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {avatarError}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-white/5 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Kelengkapan
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{completion}%</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Bergabung
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Diperbarui
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(profile?.updatedAt, true)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#151528] sm:p-6">
                  <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                      <IdCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Informasi Pribadi</h3>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        Data ini tampil di kartu profil dan menu back office.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <ProfileField label="Nama Lengkap" htmlFor="profile-name" icon={UserRound} hint="Wajib">
                      <input
                        id="profile-name"
                        value={form.displayName}
                        onChange={(event) => updateField("displayName", event.target.value)}
                        placeholder="Contoh: Amane Yuni"
                        maxLength={80}
                        required
                        className={inputClass}
                      />
                    </ProfileField>

                    <ProfileField label="Jabatan" htmlFor="profile-job" icon={BriefcaseBusiness}>
                      <input
                        id="profile-job"
                        value={form.jobTitle}
                        onChange={(event) => updateField("jobTitle", event.target.value)}
                        placeholder="Contoh: Content Administrator"
                        maxLength={80}
                        className={inputClass}
                      />
                    </ProfileField>

                    <ProfileField label="Email Login" htmlFor="profile-email" icon={Mail} hint="Tidak bisa diubah">
                      <input
                        id="profile-email"
                        value={profile?.email || session?.user.email || ""}
                        readOnly
                        className={readonlyClass}
                      />
                    </ProfileField>

                    <ProfileField label="Nomor Telepon" htmlFor="profile-phone" icon={Phone}>
                      <input
                        id="profile-phone"
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="+62 812 3456 7890"
                        inputMode="tel"
                        maxLength={24}
                        className={inputClass}
                      />
                    </ProfileField>

                    <ProfileField label="Tanggal Lahir" htmlFor="profile-birth" icon={CalendarDays}>
                      <input
                        id="profile-birth"
                        type="date"
                        value={form.birthDate}
                        onChange={(event) => updateField("birthDate", event.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className={inputClass}
                      />
                    </ProfileField>

                    <ProfileField label="Domisili" htmlFor="profile-location" icon={MapPin}>
                      <input
                        id="profile-location"
                        value={form.location}
                        onChange={(event) => updateField("location", event.target.value)}
                        placeholder="Contoh: Jakarta Selatan"
                        maxLength={80}
                        className={inputClass}
                      />
                    </ProfileField>

                    <ProfileField
                      label="Website / Portofolio"
                      htmlFor="profile-website"
                      icon={Globe2}
                      className="sm:col-span-2"
                    >
                      <input
                        id="profile-website"
                        type="url"
                        value={form.website}
                        onChange={(event) => updateField("website", event.target.value)}
                        placeholder="https://contoh.com"
                        maxLength={160}
                        className={inputClass}
                      />
                    </ProfileField>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#151528] sm:p-6">
                  <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Tentang Saya</h3>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        Ceritakan peran dan keahlian Anda secara singkat.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <textarea
                      id="profile-bio"
                      value={form.bio}
                      onChange={(event) => updateField("bio", event.target.value)}
                      rows={5}
                      maxLength={600}
                      placeholder="Contoh: Bertanggung jawab menjaga kualitas konten dan pengalaman pengguna di seluruh halaman CITS."
                      className={`${inputClass} min-h-32 resize-y leading-relaxed`}
                    />
                    <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      <span>Maksimal 600 karakter.</span>
                      <span>{form.bio.length}/600</span>
                    </div>
                  </div>
                </section>

                <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-white/10 dark:bg-[#151528]/95 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${isDirty ? "bg-amber-500" : "bg-emerald-500"}`} />
                    {isDirty ? "Ada perubahan yang belum disimpan." : "Semua perubahan sudah tersimpan."}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!isDirty || saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 sm:flex-none"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      disabled={!isDirty || saving}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-600/30 transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? "Menyimpan..." : "Simpan Profil"}
                    </button>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#151528]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                      Kelengkapan Profil
                    </h3>
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">{completion}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {completionItems.map((item) => (
                      <li key={item.label} className="flex items-center gap-2 text-[11px] font-medium">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            item.done
                              ? "bg-emerald-500 text-white"
                              : "border border-slate-300 bg-white text-transparent dark:border-white/20 dark:bg-white/5"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span
                          className={
                            item.done ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                          }
                        >
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50 via-amber-50/60 to-white p-5 shadow-sm dark:border-orange-500/20 dark:from-orange-950/30 dark:via-[#151528] dark:to-[#151528]">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Tips Foto Profil</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    <li>Gunakan foto wajah dengan pencahayaan yang cukup.</li>
                    <li>Rasio persegi (1:1) memberi hasil paling rapi.</li>
                    <li>Foto otomatis dipotong dan dioptimalkan ke 320 × 320 px.</li>
                  </ul>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#151528]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Keamanan Akun</h3>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Email login dan kata sandi tidak dapat diubah dari halaman profil. Hubungi Superadmin jika perlu
                    mereset kata sandi atau mengganti email akun.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Sesi terlindungi token bertanda tangan
                  </div>
                  {roleIsSuperadmin && (
                    <Link
                      href="/admin/settings"
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 hover:underline dark:text-orange-400"
                    >
                      Buka Pengaturan Akun
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </section>
              </aside>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
