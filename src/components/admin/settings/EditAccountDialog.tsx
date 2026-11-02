"use client";

import type { PublicInternalAccount } from "@/lib/internalAccess";
import AdminAccountEditor from "./AdminAccountEditor";
import SettingsDialog from "./SettingsDialog";

export default function EditAccountDialog({
  account,
  onClose,
  onSaved,
  onAccessSaved,
}: {
  account: PublicInternalAccount;
  onClose: () => void;
  onSaved: (account: PublicInternalAccount) => void;
  onAccessSaved?: (account: PublicInternalAccount) => void;
}) {
  return (
    <SettingsDialog
      title="Detail Akun Administrator"
      description={`Perbarui data, hak akses, dan status akun ${account.name}.`}
      busy={false}
      onClose={onClose}
    >
      <AdminAccountEditor
        variant="dialog"
        account={account}
        onCancel={onClose}
        onSaved={onSaved}
        onAccessSaved={onAccessSaved}
      />
    </SettingsDialog>
  );
}
