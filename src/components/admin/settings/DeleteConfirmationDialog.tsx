"use client";

import { BackOfficeButton as Button } from "@/components/ui/Button";
import { useRef, useState } from "react";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { deleteInternalAccount, deleteInternalAccounts, updateInternalAccount } from "@/lib/internalAccountsApi";
import type { PublicInternalAccount } from "@/lib/internalAccess";
import SettingsDialog from "./SettingsDialog";
import { secondaryButton } from "./styles";

export default function DeleteConfirmationDialog({
  accounts,
  onClose,
  onDeleted,
  onDeactivated,
}: {
  accounts: PublicInternalAccount[];
  onClose: () => void;
  onDeleted: (count: number) => void;
  onDeactivated?: (account: PublicInternalAccount) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const singleAccount = onDeactivated && accounts.length === 1 ? accounts[0] : null;
  const act = async (deactivate: boolean) => {
    if (pending.current || !accounts.length) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      if (deactivate) {
        if (!singleAccount || !onDeactivated) return;
        const saved = await updateInternalAccount(singleAccount.id, {
          name: singleAccount.name,
          email: singleAccount.email,
          pageAccess: singleAccount.pageAccess,
          permissions: singleAccount.permissions,
          isActive: false,
        });
        if (!saved?.id) throw new Error("Server tidak mengembalikan data akun.");
        onDeactivated(saved);
      } else if (singleAccount) {
        await deleteInternalAccount(singleAccount.id);
        onDeleted(1);
      } else {
        const count = await deleteInternalAccounts(accounts.map(({ id }) => id));
        onDeleted(count);
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
      title={singleAccount ? "Hapus Akun Administrator?" : `Hapus ${accounts.length} akun terpilih?`}
      description="Akun yang dihapus akan kehilangan akses ke Back Office secara permanen."
      busy={busy}
      onClose={onClose}
    >
      <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
        <ul
          aria-label="Akun yang akan dihapus"
          className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-white/10 dark:border-white/10"
        >
          {accounts.map(({ id, name, email }) => (
            <li key={id} className="px-4 py-3">
              <p className="font-semibold break-words">{name}</p>
              <p className="mt-1 text-sm break-all text-slate-600 dark:text-slate-300">{email}</p>
            </li>
          ))}
        </ul>
        {singleAccount?.isActive && (
          <>
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
              <p>Akun yang dinonaktifkan dapat diaktifkan kembali jika diperlukan.</p>
            </div>
            <Button
              variant="unstyled"
              size="none"
              type="button"
              disabled={busy}
              onClick={() => void act(true)}
              className={`${secondaryButton} w-full`}
            >
              Nonaktifkan Akun Saja
            </Button>
          </>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 p-5 dark:border-white/10">
        <Button
          variant="unstyled"
          size="none"
          type="button"
          onClick={onClose}
          disabled={busy}
          className={secondaryButton}
        >
          Batal
        </Button>
        <Button
          variant="unstyled"
          size="none"
          type="button"
          disabled={busy}
          onClick={() => void act(false)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50"
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="size-4" aria-hidden="true" />
          )}
          {busy ? "Memproses..." : singleAccount ? "Hapus Akun" : `Hapus ${accounts.length} Akun`}
        </Button>
      </footer>
    </SettingsDialog>
  );
}
