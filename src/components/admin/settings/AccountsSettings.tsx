"use client";

import { BackOfficeButton as Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCw, X } from "lucide-react";
import {
  clearLegacyAccounts,
  fetchInternalAccounts,
  migrateLegacyAccounts,
  readLegacyAccounts,
} from "@/lib/internalAccountsApi";
import type { PublicInternalAccount, SuperadminInfo } from "@/lib/internalAccess";
import RoleInformationCard from "./RoleInformationCard";
import InternalAccountsTable from "./InternalAccountsTable";
import AdminAccountEditor from "./AdminAccountEditor";
import EditAccountDialog from "./EditAccountDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function AccountsSettings() {
  const [accounts, setAccounts] = useState<PublicInternalAccount[]>([]);
  const [superadmin, setSuperadmin] = useState<SuperadminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editAccount, setEditAccount] = useState<PublicInternalAccount | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [deleting, setDeleting] = useState<{ accounts: PublicInternalAccount[]; bulk: boolean } | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchInternalAccounts();
      setAccounts(data.accounts);
      setSuperadmin(data.superadmin);
      setSelectedIds((previous) => new Set(data.accounts.filter(({ id }) => previous.has(id)).map(({ id }) => id)));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal memuat akun.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const legacy = readLegacyAccounts();
      if (legacy.length) {
        const migrated = await migrateLegacyAccounts(legacy);
        if (migrated !== null) clearLegacyAccounts();
      }
      if (!cancelled) await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const replaceAccount = (saved: PublicInternalAccount) =>
    setAccounts((previous) =>
      previous.some((item) => item.id === saved.id)
        ? previous.map((item) => (item.id === saved.id ? saved : item))
        : [...previous, saved]
    );

  const scrollToEditor = () => {
    window.setTimeout(() => {
      const editor = document.getElementById("admin-account-editor");
      editor?.querySelector("input")?.focus({ preventScroll: true });
      editor?.scrollIntoView({ block: "start" });
    }, 80);
  };

  const startCreate = () => {
    setEditorKey((key) => key + 1);
    scrollToEditor();
  };

  const startEdit = (account: PublicInternalAccount) => {
    setEditAccount(account);
  };

  const resetEditor = () => {
    setEditorKey((key) => key + 1);
  };

  const selectAccounts = (ids: string[], checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <RoleInformationCard superadmin />
        <RoleInformationCard />
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{notice}</span>
          <Button
            variant="unstyled"
            size="none"
            aria-label="Tutup notifikasi"
            onClick={() => setNotice("")}
            className="rounded-md p-1.5 hover:bg-emerald-100 dark:hover:bg-white/5"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Daftar akun belum dapat dimuat</p>
            <p className="mt-1 text-xs leading-relaxed">{error}</p>
          </div>
          <Button
            variant="unstyled"
            size="none"
            type="button"
            disabled={loading}
            onClick={() => void load()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-semibold hover:bg-red-100 dark:border-red-500/20 dark:hover:bg-red-500/10"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Coba Lagi
          </Button>
        </div>
      ) : (
        <InternalAccountsTable
          accounts={accounts}
          superadmin={superadmin}
          loading={loading}
          selectedIds={selectedIds}
          onSelect={selectAccounts}
          onClearSelection={() => setSelectedIds(new Set())}
          onBulkDelete={() => setDeleting({ accounts: accounts.filter(({ id }) => selectedIds.has(id)), bulk: true })}
          onAdd={startCreate}
          onEdit={startEdit}
          onDelete={(account) => setDeleting({ accounts: [account], bulk: false })}
        />
      )}

      <AdminAccountEditor
        key={editorKey}
        account={null}
        onCancel={resetEditor}
        onSaved={(saved) => {
          replaceAccount(saved);
          setNotice(`Akun “${saved.name}” berhasil dibuat.`);
          resetEditor();
        }}
      />

      {editAccount && (
        <EditAccountDialog
          account={editAccount}
          onClose={() => setEditAccount(null)}
          onAccessSaved={(saved) => {
            replaceAccount(saved);
            setEditAccount((current) => (current?.id === saved.id ? saved : current));
          }}
          onSaved={(saved) => {
            replaceAccount(saved);
            setNotice(`Akun “${saved.name}” berhasil diperbarui.`);
            setEditAccount(null);
          }}
        />
      )}

      {deleting && (
        <DeleteConfirmationDialog
          accounts={deleting.accounts}
          onClose={() => setDeleting(null)}
          onDeleted={(count) => {
            const ids = new Set(deleting.accounts.map(({ id }) => id));
            setAccounts((previous) => previous.filter(({ id }) => !ids.has(id)));
            setSelectedIds((previous) => new Set([...previous].filter((id) => !ids.has(id))));
            if (!deleting.bulk) setNotice(`Akun “${deleting.accounts[0].name}” berhasil dihapus.`);
            else if (count === 0) setNotice("Akun terpilih sudah tidak ada.");
            else if (count < ids.size) setNotice(`${count} akun dihapus. ${ids.size - count} akun sudah tidak ada.`);
            else setNotice(`${count} akun berhasil dihapus.`);
            setDeleting(null);
            window.requestAnimationFrame(() => document.getElementById("internal-accounts-title")?.focus());
          }}
          onDeactivated={
            deleting.bulk
              ? undefined
              : (saved) => {
                  replaceAccount(saved);
                  setNotice(`Akun “${saved.name}” dinonaktifkan.`);
                  setDeleting(null);
                }
          }
        />
      )}
    </div>
  );
}
