"use client";

import ContactEditor from "@/components/pages/admin-contact/ContactEditor";
import useContactEditor from "@/components/pages/admin-contact/useContactEditor";

export default function AdminContactPage() {
  const editor = useContactEditor();
  return <ContactEditor editor={editor} />;
}
