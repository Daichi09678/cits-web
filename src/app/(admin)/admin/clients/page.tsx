"use client";

import ClientManagementEditor from "@/components/pages/admin-clients/ClientManagementEditor";
import useClientManagementEditor from "@/components/pages/admin-clients/useClientManagementEditor";

export default function AdminClientsPage() {
  const editor = useClientManagementEditor();
  return <ClientManagementEditor editor={editor} />;
}
