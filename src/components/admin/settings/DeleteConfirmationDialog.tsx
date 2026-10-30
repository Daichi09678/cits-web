"use client";

import { useRef, useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { deleteInternalAccount, updateInternalAccount } from "@/lib/internalAccountsApi";
import type { PublicInternalAccount } from "@/lib/internalAccess";
import SettingsDialog from "./SettingsDialog";
import { secondaryButton } from "./styles";

export default function DeleteConfirmationDialog({
  account,
  onClose,
  onDeleted,
  onDeactivated,
}: {
  account: PublicInternalAccount;
  onClose: () => void;
  onDeleted: () => void;
  onDeactivated: (account: PublicInternalAccount) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const act = async (deactivate: boolean) => {
    if (pending.current || account.id === "admin-1") return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      if (deactivate) {
        const saved = await updateInternalAccount(account.id, {
          name: account.name,
          email: account.email,
          pageAccess: account.pageAccess,
          permissions: account.permissions,
          isActive: false,
        });
        if (!saved?.id) throw new Error("Server tidak mengembalikan data akun.");
        onDeactivated(saved);
      } else {
        await deleteInternalAccount(account.id);
        onDeleted();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Tindakan gagal diproses.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return (
    <SettingsDialog
      compact
      title="Hapus Akun Administrator?"
      description="Penghapusan akun bersifat permanen dan tidak dapat dibatalkan."
      busy={busy}
      onClose={onClose}
    >
      <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
          <p className="font-semibold">{account.name}</p>
          <p className="mt-1 break-all text-sm text-slate-500">{account.email}</p>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="size-5 shrink-0" />
          <p>
            Akun ini akan kehilangan akses ke Back Office. Kami menyarankan menonaktifkan akun terlebih dahulu agar
            dapat diaktifkan kembali jika diperlukan.
          </p>
        </div>
        {account.isActive && (
          <button type="button" disabled={busy} onClick={() => void act(true)} className={`${secondaryButton} w-full`}>
            Nonaktifkan Akun Saja
          </button>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 p-5 dark:border-white/10">
        <button type="button" onClick={onClose} disabled={busy} className={secondaryButton}>
          Batal
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void act(false)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50"
        >
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}Hapus Akun
        </button>
      </footer>
    </SettingsDialog>
  );
}
