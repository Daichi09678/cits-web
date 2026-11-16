"use client";

import ServiceManagementEditor from "@/components/pages/admin-services/ServiceManagementEditor";
import useServiceManagementEditor from "@/components/pages/admin-services/useServiceManagementEditor";

export default function AdminServicesPage() {
  const editor = useServiceManagementEditor();
  return <ServiceManagementEditor editor={editor} />;
}
